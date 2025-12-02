from __future__ import annotations

from langchain_text_splitters import RecursiveCharacterTextSplitter

DEFAULT_SEPARATOR = ["\n\n"]
DEFAULT_CHUNK_SIZE = 350
DEFAULT_CHUNK_OVERLAP = 75


def splitter(
    text: str,
    separators: list[str] = DEFAULT_SEPARATOR,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        separators=separators, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return text_splitter.split_text(text)
