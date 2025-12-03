from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

from app.app_conf import MAIL_COLLECTION
from app.services.vector_store.shared import AddStoreDocument, VectorStore

if TYPE_CHECKING:
    from chromadb import Where

    from app.models import Tag
    from app.services.vector_store.mail.vector_mail import VectorMail


@dataclass
class SearchResultMail:
    part: str
    mail_id: str
    section_id: str
    score: float


class MailVectorStore:
    def __init__(self) -> None:
        self.vs = VectorStore(MAIL_COLLECTION)

    def _transform_add(self, mail: VectorMail) -> AddStoreDocument:
        return AddStoreDocument(
            text=mail.part,
            metadata=mail.metadata,
        )

    def add(self, mail: VectorMail | list[VectorMail]) -> None:
        if isinstance(mail, list):
            self.vs.add_documents([self._transform_add(m) for m in mail])
        else:
            self.vs.add_document(self._transform_add(mail))

    def _build_tag_condition(self, tags: list[Tag]) -> Where:
        return {"$and": [{tag.name: tag.id} for tag in tags]}

    def search(self, query: str, top_k: int = 5, filter_tags: list[Tag] | None = None) -> list[SearchResultMail]:
        if filter_tags is None:
            filter_tags = []
        result = self.vs.search(query, top_k=top_k, where=self._build_tag_condition(filter_tags))
        return [
            SearchResultMail(
                part=r.text,
                mail_id=r.metadata["mail_id"],
                section_id=r.metadata["section_id"],
                score=r.score,
            )
            for r in result
        ]
