import itertools

from collections.abc import Sequence
from typing import Annotated

import numpy as np

from fastapi import APIRouter, Depends
from sqlalchemy import Engine

from app.app_conf import CONCEPT_WEIGHT, QUERY_WEIGHT
from app.app_resource import app_resource
from app.dtos.common import SuccessResponse
from app.dtos.vector_store import (
    ConceptDTO,
    ConceptSearchResultDTO,
    MailDTO,
    PostMailDTO,
    RegisteredCheckDTO,
    RegisteredCheckResultDTO,
    SearchDTO,
)
from app.models import Tag
from app.models._models import RegisteredMailIds
from app.services.database.engine import get_engine
from app.services.database.operation import create, read
from app.services.vector_store import ConceptVectorStore, MailVectorStore
from app.services.vector_store.mail import VectorMail


def _normalize(vec: Sequence[float]) -> np.ndarray:
    arr = np.asarray(vec, dtype=np.float32)
    norm = np.linalg.norm(arr)
    if norm == 0:
        return arr
    return arr / norm


router = APIRouter(prefix="/vector-store", tags=["Vector Store"])


def get_tags(engine: Engine, tag_ids: list[str]) -> list[Tag]:
    return list(itertools.chain.from_iterable([read(engine, Tag, [("id", "==", tag_id)]) for tag_id in tag_ids]))


@router.post("")
def add_mail_to_vector_store(body: PostMailDTO, engine: Annotated[Engine, Depends(get_engine)]) -> SuccessResponse:
    if read(engine, RegisteredMailIds, [("mail_id", "==", body.id)]):
        return SuccessResponse(message="Mail already registered")
    vs = MailVectorStore()
    tags = get_tags(engine, body.tag_ids)
    mails = VectorMail.from_pure_mail(body.mail, body.id, tags)
    vs.add(mails)
    create(engine, RegisteredMailIds(mail_id=body.id))
    return SuccessResponse(message="Mail added successfully")


@router.post("/registered-check")
def check_mail_registration(
    body: RegisteredCheckDTO, engine: Annotated[Engine, Depends(get_engine)]
) -> RegisteredCheckResultDTO:
    registered_mail = read(engine, RegisteredMailIds, [("mail_id", "==", body.mail_id)])
    return RegisteredCheckResultDTO(registered=bool(registered_mail))


@router.post("/search")
def search(body: SearchDTO, engine: Annotated[Engine, Depends(get_engine)], top_k: int = 3) -> list[MailDTO]:
    vs = MailVectorStore()
    tags = get_tags(engine, body.tag_ids)
    result = vs.search(body.query, top_k, tags)
    return [
        MailDTO(id=r.mail_id, mail_part=r.part, section_id=r.section_id)
        for r in result
        if r.mail_id is not None and r.section_id is not None
    ]


@router.post("/search-with-concept")
def search_with_concept(
    body: SearchDTO,
    engine: Annotated[Engine, Depends(get_engine)],
    top_k: int = 3,
    concept_threshold: float = 0.5,
) -> list[ConceptSearchResultDTO]:
    concept_vs = ConceptVectorStore()
    mail_vs = MailVectorStore()
    tags = get_tags(engine, body.tag_ids)

    with app_resource.embedding_model.use_model() as model:
        query_embedding = _normalize(model.embed_query(body.query))
    concepts = [c for c in concept_vs.search_by_embedding(query_embedding.tolist()) if c.score > concept_threshold]

    result: list[ConceptSearchResultDTO] = []
    included_mails: set[str] = set()
    for concept in concepts:
        concept_embedding = _normalize(concept.embedding)
        combined = _normalize((QUERY_WEIGHT * query_embedding + CONCEPT_WEIGHT * concept_embedding).tolist())
        mails: list[MailDTO] = []
        for mail in mail_vs.search_by_embedding(combined.tolist(), top_k, tags):
            if (include_flag := f"{mail.mail_id}_{mail.section_id}") not in included_mails:
                mails.append(MailDTO(id=mail.mail_id, mail_part=mail.part, section_id=mail.section_id))
                included_mails.add(include_flag)
        if mails:
            result.append(ConceptSearchResultDTO(concept=ConceptDTO(id=concept.id, label=concept.label), mails=mails))

    return result
