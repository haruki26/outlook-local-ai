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

# collections
MAIL_COLLECTION = "mail_collection"
CONCEPT_COLLECTION = "concept_collection"

# search weights
# QUERY_WEIGHT and CONCEPT_WEIGHT control the relative importance of query-based relevance and concept-based relevance in the search algorithm.
# These weights were empirically chosen to prioritize direct query matches (0.7) while still considering conceptual similarity (0.3).
# The values should sum to 1.0. Adjust only if the balance between query and concept relevance needs to be changed based on evaluation results.
QUERY_WEIGHT = 0.7
CONCEPT_WEIGHT = 0.3
