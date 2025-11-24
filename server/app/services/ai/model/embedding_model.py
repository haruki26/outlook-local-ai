from __future__ import annotations

from pathlib import Path

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openvino_genai.load_model import load_model as _load_model
from optimum.intel import OVQuantizationConfig
from sentence_transformers import (
    SentenceTransformer,
    export_static_quantized_openvino_model,
)

from app.app_conf import AI_MODELS_PATH
from app.services.ai.model.base import Model
from app.utils.logging import get_logger

logger = get_logger(__name__)

MODEL_REPO_ID = "cl-nagoya/ruri-v3-70m"


class EmbeddingModel(Model[HuggingFaceEmbeddings]):
    def load_model(self) -> HuggingFaceEmbeddings:
        logger.info("Loading embedding model")
        path = _load_model(repo_id=MODEL_REPO_ID, download_path=AI_MODELS_PATH)
        self._convert_model(path)
        self.model = HuggingFaceEmbeddings(
            model_name=path,
            model_kwargs={
                "backend": "openvino",
                "model_kwargs": {"file_name": "openvino/openvino_model_qint8_quantized.xml", "device": "AUTO"},
            },
        )
        logger.info("Embedding model loaded")
        return self.model

    def _convert_model(self, path: str) -> None:
        if (Path(path) / "openvino").exists():
            return
        logger.info("Converting model to OpenVINO format: %s", path)
        model = SentenceTransformer(path, backend="openvino")
        quantization_config = OVQuantizationConfig()
        export_static_quantized_openvino_model(model, quantization_config, path)
        logger.info("Model converted to OpenVINO format")
