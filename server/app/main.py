from __future__ import annotations

from fastapi import BackgroundTasks, FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.app_resource import app_resource

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def startup_tasks() -> None:
    app_resource.load_models()


@app.post("/trigger-startup")
def trigger_startup(background_task: BackgroundTasks) -> None:
    background_task.add_task(startup_tasks)


@app.get("/")
async def demo() -> dict[str, str]:
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
