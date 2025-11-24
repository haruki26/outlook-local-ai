from __future__ import annotations

from dataclasses import dataclass
from uuid import uuid4

from langchain_chroma import Chroma

from app.app_conf import VECTOR_STORE_PATH
from app.app_resource import app_resource
from app.services.ai.rag.ruri_prefix import QUERY_PREFIX
from app.services.ai.rag.vector_mail import VectorMail
from app.utils.logging import get_logger

logger = get_logger(__name__)

COLLECTION_NAME = "main_collection"


@dataclass
class QueryResultVectorMessage:
    mail: VectorMail
    score: float


class VectorStore:
    def __init__(self) -> None:
        self._db: Chroma = Chroma(
            COLLECTION_NAME,
            embedding_function=app_resource.embedding_model.model,
            persist_directory=str(VECTOR_STORE_PATH),
            collection_metadata={"hnsw:space": "cosine"},
        )
        logger.info("ChromaManager initialized with collection: %s", COLLECTION_NAME)

    def add_documents(
        self,
        documents: list[VectorMail],
    ) -> list[str]:
        """ドキュメントを追加する.

        Args:
            documents: 追加するドキュメントのリスト。

        Returns:
            作成したドキュメントIDのリスト。
        """
        logger.info("Adding %d documents to ChromaDB", len(documents))
        ids = [str(uuid4()) for _ in range(len(documents))]
        self._db.add_documents([d.to_ruri_retrieved_format() for d in documents], ids=ids)
        return ids

    def similarity_search(
        self,
        query: str,
        top_k: int = 3,
    ) -> list[QueryResultVectorMessage]:
        """類似度検索を行う.

        Returns:
            スコア付きの検索結果。
        """
        logger.info("Performing similarity search for query: %s", query)
        results = self._db.similarity_search_with_relevance_scores(
            self._format_ruri_query(query),
            k=top_k,
        )
        return [
            QueryResultVectorMessage(
                mail=VectorMail(doc.page_content, doc.metadata.get("message_id"), doc.metadata.get("section_id")),
                score=score,
            )
            for doc, score in results
        ]

    def _format_ruri_query(self, query: str) -> str:
        """Ruri のクエリ用フォーマットに変換する."""
        return f"{QUERY_PREFIX}{query}"


if __name__ == "__main__":
    app_resource.embedding_model.load_model()

    store = VectorStore()

    def add_documents() -> None:
        store.add_documents(
            [
                VectorMail(
                    message="重力とは、質量を持つ物体同士が引き合う力のことである。",
                    message_id="msg1",
                    section_id="sec1",
                ),
                VectorMail(
                    message="週末の打ち合わせにつきましては、土曜日の午後2時からを予定しております。",
                    message_id="msg2",
                    section_id="sec2",
                ),
                VectorMail(
                    message="Pythonは、1991年にグイド・ヴァンロッサムによって開発された高水準のプログラミング言語である。",
                    message_id="msg3",
                    section_id="sec3",
                ),
            ]
        )

    # add_documents()  # noqa: ERA001

    search_results = store.similarity_search("プログラミング言語とは", top_k=3)
    for res in search_results:
        print(f"Score: {res.score}, Message: {res.mail.message}")  # noqa: T201
