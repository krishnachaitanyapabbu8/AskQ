import re
from typing import List


DISALLOWED_SQL = re.compile(
    r"\b(insert|update|delete|drop|alter|create|attach|detach|pragma|vacuum|truncate|replace|grant|revoke)\b",
    re.IGNORECASE,
)


def strip_sql_comments(sql: str) -> str:
    sql = re.sub(r"/\*[\s\S]*?\*/", " ", sql)
    sql = re.sub(r"--.*$", " ", sql, flags=re.MULTILINE)
    return sql.strip()


def assert_safe_read_only_sql(input_sql: str) -> str:
    trimmed = input_sql.strip()
    if not trimmed:
        raise ValueError("Generated SQL is empty")

    sql_without_trailing_semicolon = re.sub(r";+\s*$", "", trimmed)
    normalized_sql = strip_sql_comments(sql_without_trailing_semicolon)

    if not re.match(r"^(select|with)\b", normalized_sql, flags=re.IGNORECASE):
        raise ValueError("Only SELECT/CTE queries are allowed")

    if DISALLOWED_SQL.search(normalized_sql):
        raise ValueError("Unsafe SQL detected")

    if ";" in normalized_sql:
        raise ValueError("Only one SQL statement is allowed")

    return sql_without_trailing_semicolon


def extract_table_names(sql: str) -> List[str]:
    table_matches = re.finditer(r"\b(?:from|join)\s+([a-zA-Z_][a-zA-Z0-9_]*)", sql, flags=re.IGNORECASE)
    names = []
    seen = set()
    for match in table_matches:
        name = match.group(1).lower()
        if name not in seen:
            seen.add(name)
            names.append(name)
    return names
