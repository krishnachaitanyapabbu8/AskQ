from typing import Any, Dict, Optional

from .db import analytics_database
from .llm_client import generate_sql_with_llm, synthesize_answer_with_llm
from .sql_guard import assert_safe_read_only_sql, extract_table_names


DEFAULT_MAX_ROWS = 50
MAX_ALLOWED_ROWS = 200


def normalize_max_rows(value: Optional[int]) -> int:
    if value is None:
        return DEFAULT_MAX_ROWS
    try:
        max_rows = int(value)
    except (TypeError, ValueError):
        return DEFAULT_MAX_ROWS
    return max(1, min(MAX_ALLOWED_ROWS, max_rows))


def run_sql_agent(question: str, max_rows: Optional[int] = None) -> Dict[str, Any]:
    analytics_database.init()

    normalized_question = question.strip()
    if not normalized_question:
        raise RuntimeError("Question is required")

    limit = normalize_max_rows(max_rows)
    sql_plan, used_fallback_model = generate_sql_with_llm(
        normalized_question,
        analytics_database.get_schema_description(),
    )

    safe_sql = assert_safe_read_only_sql(sql_plan["sql"])
    query_result = analytics_database.run_query(safe_sql, limit)
    answer_payload = synthesize_answer_with_llm(normalized_question, safe_sql, query_result["rows"])
    tables_used = sql_plan.get("tablesUsed") or extract_table_names(safe_sql)

    return {
        "title": sql_plan["title"],
        "answer": answer_payload["answer"],
        "sql": safe_sql,
        "tablesUsed": tables_used,
        "confidence": sql_plan["confidence"],
        "table": {
            "columns": query_result["columns"],
            "rows": query_result["rows"],
        },
        "insights": answer_payload["insights"],
        "followUps": sql_plan["followUps"],
        "usedFallbackModel": used_fallback_model,
    }
