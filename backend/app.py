import os
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .db import analytics_database
from .llm_client import get_llm_model, get_llm_provider, is_llm_configured
from .sql_agent_service import run_sql_agent


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SqlAgentRequest(BaseModel):
    question: str
    maxRows: Optional[int] = None


@app.on_event("startup")
def _startup() -> None:
    analytics_database.init()


@app.get("/api/health")
def health() -> dict:
    analytics_database.init()
    return {
        "ok": True,
        "service": "askq-sql-agent",
        "llmProvider": get_llm_provider(),
        "llmModel": get_llm_model(),
        "llmConfigured": is_llm_configured(),
        "fallbackEnabled": os.getenv("SQL_AGENT_ALLOW_FALLBACK", "false").lower() == "true",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/sql-agent/query")
def sql_agent_query(payload: SqlAgentRequest):
    question = payload.question if isinstance(payload.question, str) else ""
    if not question.strip():
        return JSONResponse(status_code=400, content={"error": "question is required"})

    try:
        result = run_sql_agent(question, payload.maxRows)
        return result
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("API_PORT", "3003"))
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port)
