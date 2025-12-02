from __future__ import annotations

from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

# ai
AI_MODELS_PATH = BASE_DIR / "ai_models"

# log
LOG_DIR = BASE_DIR / "logs"

# database
BASE_DB_DIR = BASE_DIR / "database"
DATABASE_PATH = BASE_DB_DIR / "db.sqlite3"
VECTOR_STORE_PATH = BASE_DB_DIR / "vector_store"

# VECTOR_STORE_COLLECTION
MAIL_COLLECTION = "mail_collection"
CONCEPT_COLLECTION = "concept_collection"
