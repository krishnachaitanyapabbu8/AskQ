# AskQ

AskQ is an enterprise analytics chat app with:

- A React/Vite frontend chat UI
- A Python backend SQL agent API that uses an LLM to generate SQL
- Server-side SQL execution against an in-memory SQLite analytics database built from mock ERP data

## SQL Agent Flow

1. User asks a question in chat.
2. Frontend sends the question to `POST /api/sql-agent/query`.
3. Backend LLM generates read-only SQL from schema context.
4. Backend validates SQL safety (`SELECT`/`WITH` only, single statement, no DML/DDL).
5. Backend executes SQL against an in-memory SQLite database.
6. Backend LLM synthesizes answer + insights from actual query rows.
7. Frontend renders answer, result table, and generated SQL.

## Prerequisites

- Node.js 18+
- Python 3.10+
- Ollama running locally (recommended)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set values:

```bash
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=onekq/OneSQL-v0.1-Qwen:1.5B-Q2_K
OLLAMA_TIMEOUT_MS=60000
API_PORT=3003
SQL_AGENT_ALLOW_FALLBACK=false
VITE_API_BASE_URL=/api
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Ensure the model is available in Ollama:

```bash
ollama pull onekq/OneSQL-v0.1-Qwen:1.5B-Q2_K
ollama serve
```

## Run

Terminal 1 (backend):

```bash
python -m backend.app
```

Terminal 2 (frontend):

```bash
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:3003`.

## Build

```bash
npm run build
```

## API

### `GET /api/health`

Returns service status and whether LLM config is present.

### `POST /api/sql-agent/query`

Request:

```json
{
  "question": "Show revenue trend by month",
  "maxRows": 50
}
```

Response:

```json
{
  "title": "Revenue Analysis",
  "answer": "Summary from executed rows...",
  "sql": "SELECT ...",
  "tablesUsed": ["monthly_revenue"],
  "confidence": 91,
  "table": {
    "columns": ["month", "revenue"],
    "rows": []
  },
  "insights": ["..."],
  "followUps": ["..."],
  "usedFallbackModel": false
}
```

## Notes

- Fallback SQL generation is intentionally disabled by default.
- Backend uses Ollama for SQL generation and answer synthesis.
- If Ollama is unavailable, you can enable rule-based fallback with `SQL_AGENT_ALLOW_FALLBACK=true`.
