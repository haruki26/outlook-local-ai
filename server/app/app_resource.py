from __future__ import annotations

from threading import Lock
from typing import Self

from app.services.ai.model import ChatModel, EmbeddingModel


class AppResource:
    _instance: Self | None = None
    _lock: Lock = Lock()

    def __init__(self) -> None:
        self.chat_model = ChatModel()
        self.embedding_model = EmbeddingModel()

    def __new__(cls) -> Self:
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
        return cls._instance

    def load_models(self) -> None:
        self.chat_model.load_model()
        self.embedding_model.load_model()

app_resource = AppResource()
