from __future__ import annotations

from typing import TYPE_CHECKING

from langchain_core.documents import Document

from app.services.vector_store.mail.splitter import splitter
from app.services.vector_store.shared.ruri_prefix import DOCUMENT_PREFIX

if TYPE_CHECKING:
    from app.models import Tag


class VectorMail(Document):
    def __init__(
        self, part: str, mail_id: str, section_id: int, tags: list[Tag] | None = None
    ) -> None:
        tags_dict = {tag.name: tag.id for tag in tags} if tags is not None else {}
        super().__init__(
            page_content=part,
            metadata={
                "mail_id": mail_id,
                "section_id": section_id,
                **tags_dict,
            },
        )

    @property
    def part(self) -> str:
        return self.page_content.removeprefix(DOCUMENT_PREFIX)

    @property
    def mail_id(self) -> str:
        if (id_ := self.metadata.get("mail_id")) is not None:
            return id_
        msg = "mail_id not found"
        raise ValueError(msg)

    @property
    def section_id(self) -> int:
        if (id_ := self.metadata.get("section_id")) is not None:
            return id_
        msg = "section_id not found"
        raise ValueError(msg)

    @staticmethod
    def from_pure_mail(body: str, mail_id: str, tags: list[Tag] | None = None) -> list[VectorMail]:
        return [
            VectorMail(part=s, mail_id=mail_id, section_id=i, tags=tags)
            for i, s in enumerate(splitter(body), start=1)
        ]
