import { createRequire } from 'node:module';
import initSqlJs, { type Database, type QueryExecResult, type SqlValue } from 'sql.js';
import {
    salesOrders,
    monthlyRevenue,
    revenueByRegion,
    topCustomers,
    products,
    inventory,
    orderFulfillment,
    lateOrdersByPlant,
    invoices,
    expenses,
    suppliers,
    employees,
} from '../src/data/mockDatabase.ts';
import type { QueryExecutionResult } from './types.ts';

interface TableSeedData {
    name: string;
    description: string;
    rows: Record<string, unknown>[];
}

const TABLES: TableSeedData[] = [
    { name: 'sales_orders', description: 'Sales order level facts', rows: salesOrders as Record<string, unknown>[] },
    { name: 'monthly_revenue', description: 'Monthly revenue and target metrics', rows: monthlyRevenue as Record<string, unknown>[] },
    { name: 'revenue_by_region', description: 'Regional revenue contribution', rows: revenueByRegion as Record<string, unknown>[] },
    { name: 'top_customers', description: 'Customer revenue ranking data', rows: topCustomers as Record<string, unknown>[] },
    { name: 'products', description: 'Product master and sales KPIs', rows: products as Record<string, unknown>[] },
    { name: 'inventory', description: 'Warehouse inventory snapshots', rows: inventory as Record<string, unknown>[] },
    { name: 'order_fulfillment', description: 'Monthly order fulfillment KPIs', rows: orderFulfillment as Record<string, unknown>[] },
    { name: 'late_orders_by_plant', description: 'Late shipment KPIs per plant', rows: lateOrdersByPlant as Record<string, unknown>[] },
    { name: 'invoices', description: 'Accounts receivable invoices', rows: invoices as Record<string, unknown>[] },
    { name: 'expenses', description: 'Expense category aggregates', rows: expenses as Record<string, unknown>[] },
    { name: 'suppliers', description: 'Supplier performance and spend', rows: suppliers as Record<string, unknown>[] },
    { name: 'employees', description: 'Employee performance and sales stats', rows: employees as Record<string, unknown>[] },
];

function toSnakeCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}

function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
        normalized[toSnakeCase(key)] = value;
    }
    return normalized;
}

function inferSqlType(values: unknown[]): 'INTEGER' | 'REAL' | 'TEXT' {
    const nonNullValues = values.filter(v => v !== null && v !== undefined);
    if (nonNullValues.length === 0) {
        return 'TEXT';
    }

    if (nonNullValues.every(v => typeof v === 'boolean')) {
        return 'INTEGER';
    }

    if (nonNullValues.every(v => typeof v === 'number' && Number.isInteger(v))) {
        return 'INTEGER';
    }

    if (nonNullValues.every(v => typeof v === 'number')) {
        return 'REAL';
    }

    return 'TEXT';
}

function normalizeValue(value: unknown): SqlValue {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'number' || typeof value === 'string' || value instanceof Uint8Array) {
        return value;
    }
    return String(value);
}

function getWasmPath(): string {
    const require = createRequire(import.meta.url);
    return require.resolve('sql.js/dist/sql-wasm.wasm');
}

export class AnalyticsDatabase {
    private db: Database | null = null;
    private schemaDescription = '';

    async init(): Promise<void> {
        if (this.db) {
            return;
        }

        const SQL = await initSqlJs({
            locateFile: () => getWasmPath(),
        });

        const db = new SQL.Database();
        const schemaLines: string[] = [];

        for (const table of TABLES) {
            const normalizedRows = table.rows.map(normalizeRow);
            if (normalizedRows.length === 0) {
                continue;
            }

            const columns = Array.from(
                normalizedRows.reduce((set, row) => {
                    for (const column of Object.keys(row)) {
                        set.add(column);
                    }
                    return set;
                }, new Set<string>()),
            );

            const columnDefinitions = columns.map(column => {
                const values = normalizedRows.map(row => row[column]);
                const sqlType = inferSqlType(values);
                return `"${column}" ${sqlType}`;
            });

            db.run(`CREATE TABLE "${table.name}" (${columnDefinitions.join(', ')});`);

            const placeholders = columns.map(() => '?').join(', ');
            const insertSql = `INSERT INTO "${table.name}" (${columns.map(column => `"${column}"`).join(', ')}) VALUES (${placeholders});`;
            const statement = db.prepare(insertSql);

            for (const row of normalizedRows) {
                const values: SqlValue[] = columns.map(column => normalizeValue(row[column]));
                statement.run(values);
            }

            statement.free();
            schemaLines.push(`${table.name} (${columns.join(', ')}) -- ${table.description}`);
        }

        this.db = db;
        this.schemaDescription = schemaLines.join('\n');
    }

    getSchemaDescription(): string {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }
        return this.schemaDescription;
    }

    runQuery(sql: string, maxRows: number): QueryExecutionResult {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        const resultSets = this.db.exec(sql);
        if (resultSets.length === 0) {
            return { columns: [], rows: [] };
        }

        const firstResult = resultSets[0] as QueryExecResult;
        const rows = firstResult.values.map((rowValues: unknown[]) => {
            const row: Record<string, unknown> = {};
            for (let i = 0; i < firstResult.columns.length; i += 1) {
                row[firstResult.columns[i]] = rowValues[i];
            }
            return row;
        });

        return {
            columns: firstResult.columns,
            rows: rows.slice(0, maxRows),
        };
    }
}

export const analyticsDatabase = new AnalyticsDatabase();
