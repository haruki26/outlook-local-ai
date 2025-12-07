from __future__ import annotations

from typing import cast

from langchain_openvino_genai import load_model
from optimum.intel import OVModelForTokenClassification
from transformers import AutoTokenizer, TokenClassificationPipeline, pipeline

from app.app_conf import AI_MODELS_PATH
from app.services.ai.model.base import Model

MODEL_REPO_ID = "tsmatz/xlm-roberta-ner-japanese"


class NERModel(Model[TokenClassificationPipeline]):
    def _load_model(self) -> TokenClassificationPipeline:
        path = load_model(repo_id=MODEL_REPO_ID, download_path=AI_MODELS_PATH)
        model = OVModelForTokenClassification.from_pretrained(path, export=True, device="AUTO")
        tokenizer = AutoTokenizer.from_pretrained(path)
        self.model = cast(
            "TokenClassificationPipeline",
            pipeline("token-classification", model=model, tokenizer=tokenizer, aggregation_strategy="simple"),  # pyright: ignore[reportCallIssue, reportArgumentType]
        )
        return self.model
