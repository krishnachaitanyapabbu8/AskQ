import json
import re
import sqlite3
import threading
from datetime import date, datetime
from typing import Any, Dict, List

from . import data


TABLES: List[Dict[str, Any]] = [
    {"name": "sales_orders", "description": "Sales order level facts", "rows": data.sales_orders},
    {"name": "monthly_revenue", "description": "Monthly revenue and target metrics", "rows": data.monthly_revenue},
    {"name": "revenue_by_region", "description": "Regional revenue contribution", "rows": data.revenue_by_region},
    {"name": "top_customers", "description": "Customer revenue ranking data", "rows": data.top_customers},
    {"name": "products", "description": "Product master and sales KPIs", "rows": data.products},
    {"name": "inventory", "description": "Warehouse inventory snapshots", "rows": data.inventory},
    {"name": "order_fulfillment", "description": "Monthly order fulfillment KPIs", "rows": data.order_fulfillment},
    {"name": "late_orders_by_plant", "description": "Late shipment KPIs per plant", "rows": data.late_orders_by_plant},
    {"name": "invoices", "description": "Accounts receivable invoices", "rows": data.invoices},
    {"name": "expenses", "description": "Expense category aggregates", "rows": data.expenses},
    {"name": "suppliers", "description": "Supplier performance and spend", "rows": data.suppliers},
    {"name": "employees", "description": "Employee performance and sales stats", "rows": data.employees},
]


def to_snake_case(value: str) -> str:
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", value)
    value = re.sub(r"[\s-]+", "_", value)
    return value.lower()


def normalize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    return {to_snake_case(key): value for key, value in row.items()}


def infer_sql_type(values: List[Any]) -> str:
    non_null = [value for value in values if value is not None]
    if not non_null:
        return "TEXT"

    if all(isinstance(value, bool) for value in non_null):
        return "INTEGER"

    if all(isinstance(value, int) and not isinstance(value, bool) for value in non_null):
        return "INTEGER"

    if all(isinstance(value, (int, float)) and not isinstance(value, bool) for value in non_null):
        return "REAL"

    return "TEXT"


def normalize_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, bool):
        return 1 if value else 0
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, (int, float, str, bytes)):
        return value
    try:
        return json.dumps(value)
    except TypeError:
        return str(value)


class AnalyticsDatabase:
    def __init__(self) -> None:
        self._conn: sqlite3.Connection | None = None
        self._schema_description = ""
        self._lock = threading.Lock()

    def init(self) -> None:
        if self._conn is not None:
            return
        with self._lock:
            if self._conn is not None:
                return

            conn = sqlite3.connect(":memory:", check_same_thread=False)
            conn.row_factory = sqlite3.Row
            schema_lines: List[str] = []

            for table in TABLES:
                normalized_rows = [normalize_row(row) for row in table["rows"]]
                if not normalized_rows:
                    continue

                columns: List[str] = []
                seen = set()
                for row in normalized_rows:
                    for column in row.keys():
                        if column not in seen:
                            seen.add(column)
                            columns.append(column)

                column_definitions = []
                for column in columns:
                    values = [row.get(column) for row in normalized_rows]
                    sql_type = infer_sql_type(values)
                    column_definitions.append(f'"{column}" {sql_type}')

                conn.execute(f'CREATE TABLE "{table["name"]}" ({", ".join(column_definitions)});')

                placeholders = ", ".join(["?"] * len(columns))
                quoted_columns = ", ".join([f'"{column}"' for column in columns])
                insert_sql = f'INSERT INTO "{table["name"]}" ({quoted_columns}) VALUES ({placeholders});'

                for row in normalized_rows:
                    values = [normalize_value(row.get(column)) for column in columns]
                    conn.execute(insert_sql, values)

                schema_lines.append(
                    f'{table["name"]} ({", ".join(columns)}) -- {table["description"]}'
                )

            conn.commit()
            self._conn = conn
            self._schema_description = "\n".join(schema_lines)

    def get_schema_description(self) -> str:
        if self._conn is None:
            raise RuntimeError("Database is not initialized")
        return self._schema_description

    def run_query(self, sql: str, max_rows: int) -> Dict[str, Any]:
        if self._conn is None:
            raise RuntimeError("Database is not initialized")

        cursor = self._conn.execute(sql)
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        fetched_rows = cursor.fetchmany(max_rows)
        rows = [dict(zip(columns, row)) for row in fetched_rows]

        return {"columns": columns, "rows": rows}


analytics_database = AnalyticsDatabase()
