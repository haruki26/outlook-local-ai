from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING
from uuid import uuid4

from app.app_conf import CONCEPT_COLLECTION
from app.models import Concept
from app.services.database.engine import get_engine
from app.services.database.operation import create, read, update
from app.services.vector_store.concept.seed import CONCEPT_SEED_DATA
from app.services.vector_store.shared import AddStoreDocument, VectorStore

if TYPE_CHECKING:
    from sqlalchemy import Engine


@dataclass
class SearchResult:
    id: str
    label: str
    score: float


class ConceptVectorStore:
    def __init__(self) -> None:
        self.vs = VectorStore(CONCEPT_COLLECTION)

    def seed(self, engine: Engine | None = None) -> None:
        if engine is None:
            engine = get_engine()
        self._seed_sql(engine)
        self._seed_vector(engine)

    def _seed_sql(self, engine: Engine) -> None:
        for concept in CONCEPT_SEED_DATA:
            if read(engine, Concept, [("label", "==", concept)]):
                continue
            create(engine, Concept(id=str(uuid4()), label=concept))

    def _seed_vector(self, engine: Engine) -> None:
        concepts = read(engine, Concept, [("is_registered_store", "==", False)])
        self.vs.seed_documents(
            [AddStoreDocument(doc_id=concept.id, text=concept.label, metadata={"type": "seed"}) for concept in concepts]
        )
        for concept in concepts:
            update(engine, Concept, {"is_registered_store": True}, where=[("id", "==", concept.id)])

    def search(self, query: str, *, top_k: int = len(CONCEPT_SEED_DATA)) -> list[SearchResult]:
        results = self.vs.search(query, top_k=top_k)
        return [SearchResult(id=result.doc_id, label=result.text, score=result.score) for result in results]


if __name__ == "__main__":
    ConceptVectorStore().seed()
