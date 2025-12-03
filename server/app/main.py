from __future__ import annotations

from contextlib import asynccontextmanager
from typing import TYPE_CHECKING

from fastapi import APIRouter, FastAPI
from sqlmodel import SQLModel
from starlette.middleware.cors import CORSMiddleware

from app.app_resource import app_resource
from app.routers import ai_router, tags_router, vector_store_router
from app.services.database.engine import get_engine
from app.services.vector_store.concept import ConceptVectorStore
from app.utils.logging import get_logger

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    engine = get_engine()
    try:
        SQLModel.metadata.create_all(engine)
        app_resource.embedding_model.load_model()
        ConceptVectorStore().seed()
        yield
    except Exception:
        logger.exception("Error during lifespan")
    finally:
        engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

routers: list[tuple[str, APIRouter]] = [("/api", ai_router), ("/api", tags_router), ("/api", vector_store_router)]

for prefix, router in routers:
    app.include_router(router, prefix=prefix)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
