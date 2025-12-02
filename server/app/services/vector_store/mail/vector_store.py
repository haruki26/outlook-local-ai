from __future__ import annotations

from typing import TYPE_CHECKING

from app.app_conf import MAIL_COLLECTION
from app.services.vector_store.shared import AddStoreDocument, VectorStore

if TYPE_CHECKING:
    from app.services.vector_store.mail.vector_mail import VectorMail


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
