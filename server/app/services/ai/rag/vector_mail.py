from __future__ import annotations

from langchain_core.documents import Document

from app.services.ai.rag.ruri_prefix import DOCUMENT_PREFIX


class VectorMail(Document):
    def __init__(
        self,
        message: str,
        message_id: str | None = None,
        section_id: str | None = None,
    ) -> None:
        super().__init__(
            page_content=message,
            metadata={
                "message_id": message_id,
                "section_id": section_id,
            },
        )

    @property
    def message(self) -> str:
        return self.page_content.removeprefix(DOCUMENT_PREFIX)

    @property
    def message_id(self) -> str | None:
        return self.metadata.get("message_id")

    @message_id.setter
    def message_id(self, value: str) -> None:
        self.metadata["message_id"] = value

    @property
    def section_id(self) -> str | None:
        return self.metadata.get("section_id")

    @section_id.setter
    def section_id(self, value: str) -> None:
        self.metadata["section_id"] = value

    def to_ruri_retrieved_format(self) -> Document:
        """Ruri の情報取得用フォーマットに変換する."""
        return Document(
            page_content=f"{DOCUMENT_PREFIX}{self.page_content}",
            metadata=self.metadata,
        )
