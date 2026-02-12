import json
import logging
import os
from typing import Any, Dict, List, Tuple, Literal

import requests
from dotenv import load_dotenv

from .sql_guard import assert_safe_read_only_sql


load_dotenv()


logger = logging.getLogger(__name__)

LlmProvider = Literal["ollama", "none"]

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "").strip()
OLLAMA_TIMEOUT_MS = int(os.getenv("OLLAMA_TIMEOUT_MS", "60000"))
FALLBACK_ENABLED = os.getenv("SQL_AGENT_ALLOW_FALLBACK", "false").lower() == "true"


def _get_preferred_provider() -> LlmProvider:
    if OLLAMA_MODEL:
        return "ollama"
    return "none"


def extract_json_from_text(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start >= 0 and end > start:
            candidate = text[start : end + 1]
            return json.loads(candidate)
        raise ValueError("LLM did not return valid JSON")


def clamp_confidence(value: Any) -> int:
    if not isinstance(value, (int, float)):
        return 75
    if value != value:
        return 75
    return max(1, min(100, int(round(value))))


def sanitize_string_list(value: Any, fallback: List[str]) -> List[str]:
    if not isinstance(value, list):
        return fallback
    items = [str(item).strip() for item in value if str(item).strip()]
    if not items:
        return fallback
    return items[:5]


def fallback_sql_generation(question: str) -> Dict[str, Any]:
    q = question.lower()

    if "revenue" in q or "sales" in q:
        return {
            "title": "Revenue Analysis",
            "sql": "SELECT month, revenue, target, orders FROM monthly_revenue ORDER BY month DESC LIMIT 12",
            "tablesUsed": ["monthly_revenue"],
            "confidence": 70,
            "followUps": ["Break down revenue by region", "Show top customers by revenue", "Compare revenue vs target"],
        }

    if "inventory" in q or "stock" in q:
        return {
            "title": "Inventory Analysis",
            "sql": "SELECT product, warehouse, quantity, value, status FROM inventory ORDER BY quantity ASC LIMIT 25",
            "tablesUsed": ["inventory"],
            "confidence": 70,
            "followUps": ["Show low stock items", "Inventory by warehouse", "Top inventory value products"],
        }

    if "invoice" in q or "payment" in q or "overdue" in q:
        return {
            "title": "Invoice Analysis",
            "sql": "SELECT id, customer, amount, status, due_date, days_overdue FROM invoices ORDER BY days_overdue DESC LIMIT 25",
            "tablesUsed": ["invoices"],
            "confidence": 70,
            "followUps": ["Only overdue invoices", "Invoices by customer", "Total overdue amount"],
        }

    return {
        "title": "Sales Orders Overview",
        "sql": "SELECT id, customer, region, product, quantity, total, status, order_date FROM sales_orders ORDER BY order_date DESC LIMIT 25",
        "tablesUsed": ["sales_orders"],
        "confidence": 68,
        "followUps": ["Top customers", "Orders by region", "Delivered vs pending orders"],
    }


def fallback_answer(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not rows:
        return {
            "answer": "No rows matched your query for the selected dataset.",
            "insights": [
                "Try broadening the date range or reducing filters.",
                "Confirm table and column names in your question.",
            ],
        }

    sample = rows[0]
    sample_fields = ", ".join(list(sample.keys())[:4])

    return {
        "answer": (
            f"Query executed successfully and returned {len(rows)} rows. "
            "I included the result table so you can review the exact records."
        ),
        "insights": [
            f"First row includes: {sample_fields or 'no visible columns'}.",
            "Use follow-up prompts to aggregate, compare, or filter this result set further.",
        ],
    }


def ollama_generate_json(system_prompt: str, user_prompt: str, temperature: float) -> Dict[str, Any]:
    timeout_seconds = max(1.0, OLLAMA_TIMEOUT_MS / 1000.0)
    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "system": system_prompt,
                "prompt": user_prompt,
                "stream": False,
                "format": "json",
                "options": {"temperature": temperature},
            },
            timeout=timeout_seconds,
        )
    except requests.exceptions.Timeout as exc:
        raise RuntimeError(f"Ollama request timed out after {OLLAMA_TIMEOUT_MS}ms") from exc
    except requests.exceptions.RequestException as exc:
        raise RuntimeError(f"Failed to reach Ollama: {exc}") from exc

    if response.status_code >= 400:
        error_text = response.text.strip()
        details = error_text
        try:
            parsed = response.json()
            if isinstance(parsed, dict) and parsed.get("error"):
                details = parsed["error"]
        except json.JSONDecodeError:
            pass
        raise RuntimeError(f"Ollama returned {response.status_code}: {details or 'unknown error'}")

    payload = response.json()
    if isinstance(payload, dict) and payload.get("error"):
        raise RuntimeError(payload["error"])

    raw_text = payload.get("response", "").strip() if isinstance(payload, dict) else ""
    if not raw_text:
        raise RuntimeError("Ollama response is empty")

    return extract_json_from_text(raw_text)


def is_llm_configured() -> bool:
    return _get_preferred_provider() != "none"


def get_llm_provider() -> LlmProvider:
    return _get_preferred_provider()


def get_llm_model() -> str:
    return OLLAMA_MODEL


def generate_sql_with_llm(
    question: str,
    schema_description: str,
) -> Tuple[Dict[str, Any], bool]:
    if not is_llm_configured():
        if FALLBACK_ENABLED:
            return fallback_sql_generation(question), True
        raise RuntimeError("Ollama model is not configured. Set OLLAMA_MODEL and ensure Ollama is running.")

    system_prompt = " ".join(
        [
            "You are a senior SQL agent.",
            "Generate one read-only SQLite query for the user question.",
            "Only use tables/columns from the provided schema.",
            "Use SELECT or WITH only, never DML/DDL.",
            "Always include a LIMIT <= 100 unless aggregation returns few rows.",
            "Return strict JSON only with keys: title, sql, confidence, tablesUsed, followUps.",
        ]
    )

    user_prompt = f"Schema:\n{schema_description}\n\nQuestion:\n{question}"

    try:
        payload = ollama_generate_json(system_prompt, user_prompt, 0.0)
        sql = str(payload.get("sql", "")).strip()
        if not sql:
            raise RuntimeError("LLM did not return SQL")

        try:
            assert_safe_read_only_sql(sql)
        except Exception as validation_error:
            raise RuntimeError(f"Generated SQL is unsafe: {validation_error}") from validation_error

        result = {
            "title": str(payload.get("title", "")).strip() or "SQL Query Result",
            "sql": sql,
            "confidence": clamp_confidence(payload.get("confidence")),
            "tablesUsed": sanitize_string_list(payload.get("tablesUsed"), []),
            "followUps": sanitize_string_list(payload.get("followUps"), ["Show the same data with different filters"]),
        }

        return result, False
    except Exception as exc:
        if FALLBACK_ENABLED:
            logger.warning("Falling back due to error: %s", exc)
            return fallback_sql_generation(question), True
        raise RuntimeError(f"Ollama SQL generation failed: {exc}") from exc


def synthesize_answer_with_llm(
    question: str,
    sql: str,
    rows: List[Dict[str, Any]],
) -> Dict[str, Any]:
    if not is_llm_configured():
        return fallback_answer(rows)

    system_prompt = " ".join(
        [
            "You are a data analyst.",
            "Summarize SQL results clearly and briefly.",
            "Do not invent values not present in result rows.",
            "Return strict JSON only with keys: answer, insights.",
            "insights must be an array of 2-4 concise bullets.",
        ]
    )

    preview_rows = rows[:20]
    user_prompt = f"Question: {question}\nSQL: {sql}\nRows ({len(rows)}): {json.dumps(preview_rows)}"

    try:
        payload = ollama_generate_json(system_prompt, user_prompt, 0.2)
        answer = str(payload.get("answer", "")).strip() or f"Query executed successfully and returned {len(rows)} rows."
        insights = sanitize_string_list(
            payload.get("insights"),
            [f"Returned {len(rows)} rows.", "Inspect the table for exact record-level values."],
        )

        return {"answer": answer, "insights": insights}
    except Exception:
        return fallback_answer(rows)
