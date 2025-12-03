from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, cast
from uuid import uuid4

from app.app_resource import app_resource
from app.services.vector_store.shared.ruri_prefix import DOCUMENT_PREFIX, QUERY_PREFIX

if TYPE_CHECKING:
    from chromadb import Where


@dataclass
class AddStoreDocument:
    text: str
    doc_id: str = field(default_factory=lambda: str(uuid4()))
    metadata: dict = field(default_factory=dict)


@dataclass
class ResultSearch:
    doc_id: str
    text: str
    score: float
    metadata: dict = field(default_factory=dict)


class VectorStore:
    def __init__(self, collection: str) -> None:
        self.client = app_resource.chroma_client
        self.collection = self.client.get_or_create_collection(
            name=collection, configuration={"hnsw": {"space": "cosine"}}
        )
        app_resource.embedding_model.load_model()

    def _trans_to_document_form(self, text: str) -> str:
        return DOCUMENT_PREFIX + text

    def _trans_to_query_form(self, text: str) -> str:
        return QUERY_PREFIX + text

    def add_document(self, document: AddStoreDocument) -> None:
        with app_resource.embedding_model.use_model() as model:
            embedding = model.embed_documents([self._trans_to_document_form(document.text)])[0]
        self.collection.add(
            ids=[document.doc_id], documents=[document.text], metadatas=[document.metadata], embeddings=[embedding]
        )

    def add_documents(self, documents: list[AddStoreDocument]) -> None:
        with app_resource.embedding_model.use_model() as model:
            embeddings = model.embed_documents([self._trans_to_document_form(doc.text) for doc in documents])
        self.collection.add(
            ids=[doc.doc_id for doc in documents],
            documents=[doc.text for doc in documents],
            metadatas=[doc.metadata for doc in documents],
            embeddings=list(embeddings),  # 型チェッカーに怒られるのでlist関数でラップ
        )

    def seed_documents(self, documents: list[AddStoreDocument]) -> None:
        with app_resource.embedding_model.use_model() as model:
            embeddings = model.embed_documents([self._trans_to_document_form(doc.text) for doc in documents])
        self.collection.upsert(
            ids=[doc.doc_id for doc in documents],
            documents=[doc.text for doc in documents],
            metadatas=[doc.metadata for doc in documents],
            embeddings=list(embeddings),  # 型チェッカーに怒られるのでlist関数でラップ
        )

    def search(self, query: str, *, top_k: int = 3, where: Where | None = None) -> list[ResultSearch]:
        with app_resource.embedding_model.use_model() as model:
            query_embedding = model.embed_query(self._trans_to_query_form(query))
        result = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"],
        )
        ids = result.get("ids")[0]

        try:
            documents = cast("list[list[str]]", result.get("documents"))[0]
            distances = cast("list[list[float]]", result.get("distances"))[0]
            metadatas = cast("list[list[dict]]", result.get("metadatas"))[0]
        except IndexError:
            msg = "Something went wrong"
            raise ValueError(msg) from None

        return [
            ResultSearch(
                doc_id=ids[i],
                text=documents[i],
                score=1 - distances[i],
                metadata=metadatas[i],
            )
            for i in range(len(ids))
        ]


if __name__ == "__main__":
    vector_store = VectorStore("test_collection")

    def add_document() -> None:
        docs = [
            AddStoreDocument(doc_id="1", text="Hello, world!", metadata={"source": "example"}),
            AddStoreDocument(doc_id="2", text="Goodbye, world!", metadata={"source": "example"}),
            AddStoreDocument(doc_id="3", text="How are you?", metadata={"source": "example"}),
        ]
        vector_store.add_documents(docs)

    # add_document()  # noqa: ERA001

    result = vector_store.search("hello")

    for r in result:
        print(r)  # noqa: T201
