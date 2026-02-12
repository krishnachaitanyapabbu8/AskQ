import type { ChartData, TableColumn } from '../types';

interface SqlAgentApiResponse {
    title: string;
    answer: string;
    sql: string;
    tablesUsed: string[];
    confidence: number;
    table: {
        columns: string[];
        rows: Record<string, unknown>[];
    };
    insights: string[];
    followUps: string[];
    usedFallbackModel: boolean;
}

export interface SqlAgentUiResponse {
    title: string;
    content: string;
    keyMetric: {
        value: string;
        label: string;
        change: string;
        changeType: 'positive' | 'negative' | 'neutral';
    };
    sqlQuery: string;
    tablesUsed: string[];
    confidence: number;
    tableData: {
        title: string;
        columns: TableColumn[];
        rows: Record<string, unknown>[];
    };
    chartData?: ChartData;
    insights: string[];
    drillDownOptions: string[];
    usedFallbackModel: boolean;
}

const DEFAULT_API_BASE_URL = '/api';

function inferColumnType(value: unknown): TableColumn['type'] {
    if (typeof value === 'number') {
        if (Math.abs(value) > 999) {
            return 'currency';
        }
        return 'number';
    }

    if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (['paid', 'pending', 'overdue', 'delivered', 'in transit', 'critical', 'low stock', 'adequate', 'overstocked'].includes(lower)) {
            return 'status';
        }
    }

    return 'text';
}

function toColumnLabel(column: string): string {
    return column
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function buildChartData(columns: string[], rows: Record<string, unknown>[]): ChartData | undefined {
    if (rows.length < 2 || columns.length < 2) {
        return undefined;
    }

    const firstRow = rows[0];
    const dimensionColumn = columns.find(column => typeof firstRow[column] === 'string');
    const metricColumn = columns.find(column => typeof firstRow[column] === 'number');

    if (!dimensionColumn || !metricColumn) {
        return undefined;
    }

    const chartRows = rows.slice(0, 8).map(row => ({
        name: String(row[dimensionColumn]),
        value: Number(row[metricColumn] ?? 0),
    }));

    return {
        type: 'bar',
        data: chartRows,
        xKey: 'name',
        yKey: 'value',
        colors: ['#1a7b8c'],
    };
}

export async function querySqlAgent(question: string): Promise<SqlAgentUiResponse> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
    const response = await fetch(`${baseUrl}/sql-agent/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, maxRows: 50 }),
    });

    if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({ error: 'Failed to query SQL agent' }));
        throw new Error(typeof errorPayload.error === 'string' ? errorPayload.error : 'Failed to query SQL agent');
    }

    const payload = (await response.json()) as SqlAgentApiResponse;
    const columns = payload.table.columns;
    const rows = payload.table.rows;

    const typedColumns: TableColumn[] = columns.map((column) => ({
        key: column,
        label: toColumnLabel(column),
        type: inferColumnType(rows[0]?.[column]),
    }));

    return {
        title: payload.title,
        content: payload.answer,
        keyMetric: {
            value: rows.length.toLocaleString(),
            label: 'Rows Returned',
            change: payload.usedFallbackModel ? 'Fallback model' : 'LLM generated SQL',
            changeType: payload.usedFallbackModel ? 'neutral' : 'positive',
        },
        sqlQuery: payload.sql,
        tablesUsed: payload.tablesUsed,
        confidence: payload.confidence,
        tableData: {
            title: `${payload.title} (${rows.length} rows)`,
            columns: typedColumns,
            rows,
        },
        chartData: buildChartData(columns, rows),
        insights: payload.insights,
        drillDownOptions: payload.followUps,
        usedFallbackModel: payload.usedFallbackModel,
    };
}
