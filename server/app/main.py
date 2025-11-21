from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware


def setup_server() -> FastAPI:
    """Setup the FastAPI server with CORS middleware."""
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def demo() -> dict[str, str]:
        return {"message": "Hello World"}

    return app


app = setup_server()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
