from pydantic import BaseModel

from app.services.ai.chat.agent import Role


class CreateSummaryDTO(BaseModel):
    source: str


class SummaryDTO(BaseModel):
    text: str


class MessageDTO(BaseModel):
    role: Role
    message: str

class ChatDTO(BaseModel):
    messages: list[MessageDTO]
