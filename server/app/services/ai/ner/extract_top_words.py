from __future__ import annotations

from app.app_resource import app_resource


def extract_top_words(text: str, num_words: int = 3) -> list[str]:
    """Return up to num_words entities with highest score."""
    if num_words <= 0:
        return []

    with app_resource.ner_model.use_model() as model:
        result = model(text)
    if not result:
        return []

    sorted_entities = sorted(
        (entity for entity in result if isinstance(entity, dict)),
        key=lambda entity: float(entity.get("score", 0.0)),
        reverse=True,
    )

    top_words: set[str] = set()
    for entity in sorted_entities:
        word = entity.get("word")
        if word is None or word in top_words:
            continue
        top_words.add(word)
        if len(top_words) >= num_words:
            break
    return list(top_words)


if __name__ == "__main__":
    import time

    app_resource.ner_model.load_model()
    sample = "昨日は東京で買い物をした"

    start_time = time.time()
    top_words = extract_top_words(sample, num_words=3)
    end_time = time.time()

    print(top_words)  # noqa: T201
    print(f"Execution time: {end_time - start_time:.6f} seconds")  # noqa: T201
