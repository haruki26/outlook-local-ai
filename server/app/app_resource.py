from __future__ import annotations

from threading import Lock
from typing import Self

from chromadb import PersistentClient

from app.app_conf import VECTOR_STORE_PATH
from app.services.ai.model import ChatModel, EmbeddingModel, NERModel


class AppResource:
    _instance: Self | None = None
    _lock: Lock = Lock()
    _initialized: bool = False

    def __init__(self) -> None:
        if self._initialized:
            return

        self._initialized = True

        self.chat_model = ChatModel()
        self.embedding_model = EmbeddingModel()
        self.ner_model = NERModel()

        self.chroma_client = PersistentClient(VECTOR_STORE_PATH)

    def __new__(cls) -> Self:
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
        return cls._instance

    def load_models(self) -> None:
        self.embedding_model.load_model()
        self.ner_model.load_model()


app_resource = AppResource()
