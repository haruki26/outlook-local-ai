from uuid import uuid4

from sqlmodel import Field, SQLModel


class Tag(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str = Field(max_length=255)


class Concept(SQLModel, table=True):
    id: str = Field(primary_key=True)
    label: str = Field(max_length=255, index=True)
    is_registered_store: bool = Field(default=False)


class RegisteredMailIds(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    mail_id: str = Field(max_length=255, index=True)
