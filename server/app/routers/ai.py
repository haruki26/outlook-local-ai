from collections.abc import Iterator
from typing import cast

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.app_resource import app_resource
from app.dtos.ai import ChatDTO, CreateSummaryDTO, MessageDTO, NERResponseDTO, PostNERDTO, SummaryDTO
from app.services.ai.chat.agent import ChatAgent, Role
from app.services.ai.ner import extract_top_words
from app.services.ai.summarize.agent import SummarizeAgent

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/summarize")
def summarize(body: CreateSummaryDTO) -> SummaryDTO:
    agent = SummarizeAgent()
    res = agent.invoke({"source_text": body.source})

    if res is None:
        raise HTTPException(status_code=500, detail="Failed to create summary")
    return SummaryDTO(text=res)


@router.post("/chat")
def chat(body: MessageDTO) -> MessageDTO:
    agent = app_resource.chat_model
    with agent.use_model() as model:
        res = model.invoke([("human", body.message)])

    if not isinstance(res.content, str):
        raise HTTPException(status_code=500, detail="Failed to generate response")
    return MessageDTO(message=res.content, role="assistant")


@router.post("/chat-stream")
def chat_stream(body: ChatDTO) -> StreamingResponse:
    conv = cast("list[tuple[Role, str]]", [(m.role, m.message) for m in body.messages])
    agent = ChatAgent()

    def stream() -> Iterator[str]:
        yield from agent.stream({"messages": conv})

    return StreamingResponse(stream(), media_type="text/event-stream")


@router.post("/ner")
def ner(body: PostNERDTO, count: int = 3) -> list[NERResponseDTO]:
    return [NERResponseDTO(text=text) for text in extract_top_words(body.text, count)]
