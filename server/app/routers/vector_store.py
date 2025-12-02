import itertools

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import Engine

from app.dtos.common import SuccessResponse
from app.dtos.vector_store import MailDTO, PostMailDTO, SearchDTO
from app.models import Tag
from app.services.ai.rag import VectorMail, VectorStore
from app.services.database.engine import get_engine
from app.services.database.operation import read

router = APIRouter(prefix="/vector-store", tags=["Vector Store"])


@router.post("")
def add_mail_to_vector_store(body: PostMailDTO) -> SuccessResponse:
    vs = VectorStore()
    mails = VectorMail.from_pure_mail(body.mail)
    vs.add_documents(mails)
    return SuccessResponse(message="Mail added successfully")


@router.post("/search")
def search(body: SearchDTO, engine: Annotated[Engine, Depends(get_engine)], top_k: int = 3) -> list[MailDTO]:
    vs = VectorStore()
    tags = list(itertools.chain.from_iterable([read(engine, Tag, [("id", "==", tag_id)]) for tag_id in body.tags]))
    result = vs.similarity_search(body.query, top_k, tags)
    return [
        MailDTO(id=r.mail.mail_id, mail_part=r.mail.mail_part, section_id=r.mail.section_id)
        for r in result
        if r.mail.mail_id is not None and r.mail.section_id is not None
    ]
