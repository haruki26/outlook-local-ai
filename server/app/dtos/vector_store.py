from pydantic import BaseModel


class PostMailDTO(BaseModel):
    id: str
    mail: str
    tag_ids: list[str]


class RegisteredCheckDTO(BaseModel):
    mail_id: str


class RegisteredCheckResultDTO(BaseModel):
    registered: bool


class MailDTO(BaseModel):
    id: str
    mail_part: str
    section_id: int


class ConceptDTO(BaseModel):
    id: str
    label: str


class ConceptSearchResultDTO(BaseModel):
    concept: ConceptDTO
    mails: list[MailDTO]


class SearchDTO(BaseModel):
    query: str
    tag_ids: list[str]
