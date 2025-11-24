from __future__ import annotations

from langchain_openvino_genai import ChatOpenVINO, OpenVINOLLM
from langchain_openvino_genai import load_model as _load_model

from app.app_conf import AI_MODELS_PATH
from app.services.ai.model.base import Model
from app.utils.logging import get_logger

logger = get_logger(__name__)

MODEL_REPO_ID = "OpenVINO/Phi-4-mini-instruct-int8-ov"


class ChatModel(Model[ChatOpenVINO]):
    def load_model(self) -> ChatOpenVINO:
        logger.info("Loading chat model...")
        path = _load_model(repo_id=MODEL_REPO_ID, download_path=AI_MODELS_PATH)
        llm = OpenVINOLLM.from_model_path(path)
        self.model = ChatOpenVINO(llm=llm)
        logger.info("Chat model loaded.")
        return self.model


if __name__ == "__main__":
    import time

    model = ChatModel()
    model.load_model()

    with model.use_model() as chat_model:
        messages = [
            (
                "system",
                "あなたは優秀なアシスタントです。ユーザの質問に対して、丁寧に答えてください。",
            ),
            ("human", "こんにちは、あなたは何ができますか?"),
        ]
        start = time.time()
        first_token_at = None
        for chunk in chat_model.stream(messages):
            if first_token_at is None:
                first_token_at = time.time()
            print(chunk.content, end="", flush=True)  # noqa: T201
        end = time.time()

        print(f"\nTime taken: {end - start} seconds")  # noqa: T201
        print(f"First token time: {first_token_at - start} seconds")  # pyright: ignore[reportOptionalOperand]  # noqa: T201
