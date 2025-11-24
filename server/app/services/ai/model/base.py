from __future__ import annotations

from abc import ABC, abstractmethod
from contextlib import contextmanager
from threading import Lock
from typing import TYPE_CHECKING, Self

if TYPE_CHECKING:
    from collections.abc import Iterator


class Model[TModel](ABC):
    def __init_subclass__(cls) -> None:
        super().__init_subclass__()
        cls._instance = None
        cls._lock = Lock()

    model: TModel | None = None

    def __new__(cls) -> Self:
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
        return cls._instance

    @abstractmethod
    def load_model(self) -> TModel:
        raise NotImplementedError

    @contextmanager
    def use_model(self) -> Iterator[TModel]:
        with self._lock:
            if self.model is None:
                self.model = self.load_model()
            yield self.model
