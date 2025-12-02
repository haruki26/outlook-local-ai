from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import Engine

from app.dtos.common import SuccessResponse
from app.dtos.tag import PostTagDTO, TagDTO
from app.models import Tag
from app.services.database.engine import get_engine
from app.services.database.operation import create, read

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.get("")
def get_tags(engine: Annotated[Engine, Depends(get_engine)]) -> list[TagDTO]:
    tags = read(engine, Tag)
    return [TagDTO(id=tag.id, name=tag.name) for tag in tags]


@router.post("")
def create_tag(body: PostTagDTO, engine: Annotated[Engine, Depends(get_engine)]) -> SuccessResponse:
    if read(engine, Tag, [("name", "==", body.name)]):
        return SuccessResponse(message="Tag already exists")
    tag = Tag(name=body.name)
    create(engine, tag)
    return SuccessResponse(message="Tag created successfully")
