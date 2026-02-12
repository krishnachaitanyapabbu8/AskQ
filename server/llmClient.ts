import { assertSafeReadOnlySql } from './sqlGuard.ts';
import type { SqlGenerationResult } from './types.ts';

interface SqlGenerationPayload {
    title: string;
    sql: string;
    confidence: number;
    tablesUsed: string[];
    followUps: string[];
}

interface AnswerPayload {
    answer: string;
    insights: string[];
}

interface OllamaGenerateResponse {
    response?: string;
    error?: string;
}

type LlmProvider = 'ollama' | 'none';

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434').replace(/\/+$/, '');
const OLLAMA_MODEL = (process.env.OLLAMA_MODEL ?? '').trim();
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 60000);
const FALLBACK_ENABLED = process.env.SQL_AGENT_ALLOW_FALLBACK === 'true';

function getPreferredProvider(): LlmProvider {
    if (OLLAMA_MODEL) {
        return 'ollama';
    }
    return 'none';
}

function extractJsonFromText(text: string): Record<string, unknown> {
    try {
        return JSON.parse(text);
    } catch {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            const candidate = text.slice(start, end + 1);
            return JSON.parse(candidate);
        }
        throw new Error('LLM did not return valid JSON');
    }
}

function clampConfidence(value: unknown): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return 75;
    }
    return Math.max(1, Math.min(100, Math.round(value)));
}

function sanitizeStringList(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) {
        return fallback;
    }
    const items = value
        .map(item => String(item).trim())
        .filter(Boolean);
    if (items.length === 0) {
        return fallback;
    }
    return items.slice(0, 5);
}

function fallbackSqlGeneration(question: string): SqlGenerationResult {
    const q = question.toLowerCase();

    if (q.includes('revenue') || q.includes('sales')) {
        return {
            title: 'Revenue Analysis',
            sql: 'SELECT month, revenue, target, orders FROM monthly_revenue ORDER BY month DESC LIMIT 12',
            tablesUsed: ['monthly_revenue'],
            confidence: 70,
            followUps: ['Break down revenue by region', 'Show top customers by revenue', 'Compare revenue vs target'],
        };
    }

    if (q.includes('inventory') || q.includes('stock')) {
        return {
            title: 'Inventory Analysis',
            sql: 'SELECT product, warehouse, quantity, value, status FROM inventory ORDER BY quantity ASC LIMIT 25',
            tablesUsed: ['inventory'],
            confidence: 70,
            followUps: ['Show low stock items', 'Inventory by warehouse', 'Top inventory value products'],
        };
    }

    if (q.includes('invoice') || q.includes('payment') || q.includes('overdue')) {
        return {
            title: 'Invoice Analysis',
            sql: 'SELECT id, customer, amount, status, due_date, days_overdue FROM invoices ORDER BY days_overdue DESC LIMIT 25',
            tablesUsed: ['invoices'],
            confidence: 70,
            followUps: ['Only overdue invoices', 'Invoices by customer', 'Total overdue amount'],
        };
    }

    return {
        title: 'Sales Orders Overview',
        sql: 'SELECT id, customer, region, product, quantity, total, status, order_date FROM sales_orders ORDER BY order_date DESC LIMIT 25',
        tablesUsed: ['sales_orders'],
        confidence: 68,
        followUps: ['Top customers', 'Orders by region', 'Delivered vs pending orders'],
    };
}

function fallbackAnswer(rows: Record<string, unknown>[]): AnswerPayload {
    if (rows.length === 0) {
        return {
            answer: 'No rows matched your query for the selected dataset.',
            insights: ['Try broadening the date range or reducing filters.', 'Confirm table and column names in your question.'],
        };
    }

    const sample = rows[0];
    const sampleFields = Object.keys(sample).slice(0, 4).join(', ');

    return {
        answer: `Query executed successfully and returned ${rows.length} rows. I included the result table so you can review the exact records.`,
        insights: [
            `First row includes: ${sampleFields || 'no visible columns'}.`,
            'Use follow-up prompts to aggregate, compare, or filter this result set further.',
        ],
    };
}

async function ollamaGenerateJson(systemPrompt: string, userPrompt: string, temperature: number): Promise<Record<string, unknown>> {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), OLLAMA_TIMEOUT_MS);

    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                system: systemPrompt,
                prompt: userPrompt,
                stream: false,
                format: 'json',
                options: {
                    temperature,
                },
            }),
            signal: abortController.signal,
        });

        if (!response.ok) {
            const errorText = (await response.text()).trim();
            let details = errorText;
            try {
                const parsed = JSON.parse(errorText) as { error?: string };
                if (parsed.error) {
                    details = parsed.error;
                }
            } catch {
                // Keep raw text when response is not JSON.
            }
            throw new Error(`Ollama returned ${response.status}: ${details || 'unknown error'}`);
        }

        const payload = (await response.json()) as OllamaGenerateResponse;
        if (payload.error) {
            throw new Error(payload.error);
        }

        const rawText = typeof payload.response === 'string' ? payload.response.trim() : '';
        if (!rawText) {
            throw new Error('Ollama response is empty');
        }

        return extractJsonFromText(rawText);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Ollama request timed out after ${OLLAMA_TIMEOUT_MS}ms`);
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

export function isLlmConfigured(): boolean {
    return getPreferredProvider() !== 'none';
}

export function getLlmProvider(): LlmProvider {
    return getPreferredProvider();
}

export function getLlmModel(): string {
    return OLLAMA_MODEL;
}

export async function generateSqlWithLlm(
    question: string,
    schemaDescription: string,
): Promise<{ result: SqlGenerationResult; usedFallbackModel: boolean }> {
    if (!isLlmConfigured()) {
        if (FALLBACK_ENABLED) {
            return { result: fallbackSqlGeneration(question), usedFallbackModel: true };
        }
        throw new Error('Ollama model is not configured. Set OLLAMA_MODEL and ensure Ollama is running.');
    }

    const systemPrompt = [
        'You are a senior SQL agent.',
        'Generate one read-only SQLite query for the user question.',
        'Only use tables/columns from the provided schema.',
        'Use SELECT or WITH only, never DML/DDL.',
        'Always include a LIMIT <= 100 unless aggregation returns few rows.',
        'Return strict JSON only with keys: title, sql, confidence, tablesUsed, followUps.',
    ].join(' ');

    const userPrompt = `Schema:\n${schemaDescription}\n\nQuestion:\n${question}`;

    try {
        const payload = await ollamaGenerateJson(systemPrompt, userPrompt, 0);
        const sqlPayload = payload as Partial<SqlGenerationPayload>;

        const sql = typeof sqlPayload.sql === 'string' ? sqlPayload.sql.trim() : '';
        if (!sql) {
            throw new Error('LLM did not return SQL');
        }

        // Validate SQL safety before returning.
        try {
            assertSafeReadOnlySql(sql);
        } catch (validationError) {
            throw new Error(`Generated SQL is unsafe: ${validationError instanceof Error ? validationError.message : String(validationError)}`);
        }

        const result: SqlGenerationResult = {
            title: typeof sqlPayload.title === 'string' && sqlPayload.title.trim() ? sqlPayload.title.trim() : 'SQL Query Result',
            sql,
            confidence: clampConfidence(sqlPayload.confidence),
            tablesUsed: sanitizeStringList(sqlPayload.tablesUsed, []),
            followUps: sanitizeStringList(sqlPayload.followUps, ['Show the same data with different filters']),
        };

        return { result, usedFallbackModel: false };
    } catch (error) {
        if (FALLBACK_ENABLED) {
            // eslint-disable-next-line no-console
            console.warn(`Falling back due to error: ${error instanceof Error ? error.message : String(error)}`);
            return { result: fallbackSqlGeneration(question), usedFallbackModel: true };
        }
        if (error instanceof Error) {
            throw new Error(`Ollama SQL generation failed: ${error.message}`);
        }
        throw new Error('Ollama SQL generation failed');
    }
}

export async function synthesizeAnswerWithLlm(
    question: string,
    sql: string,
    rows: Record<string, unknown>[],
): Promise<{ answer: string; insights: string[] }> {
    if (!isLlmConfigured()) {
        return fallbackAnswer(rows);
    }

    const systemPrompt = [
        'You are a data analyst.',
        'Summarize SQL results clearly and briefly.',
        'Do not invent values not present in result rows.',
        'Return strict JSON only with keys: answer, insights.',
        'insights must be an array of 2-4 concise bullets.',
    ].join(' ');

    const previewRows = rows.slice(0, 20);
    const userPrompt = `Question: ${question}\nSQL: ${sql}\nRows (${rows.length}): ${JSON.stringify(previewRows)}`;

    try {
        const payload = await ollamaGenerateJson(systemPrompt, userPrompt, 0.2);
        const answerPayload = payload as Partial<AnswerPayload>;

        const answer = typeof answerPayload.answer === 'string' && answerPayload.answer.trim()
            ? answerPayload.answer.trim()
            : `Query executed successfully and returned ${rows.length} rows.`;
        const insights = sanitizeStringList(answerPayload.insights, [
            `Returned ${rows.length} rows.`,
            'Inspect the table for exact record-level values.',
        ]);

        return { answer, insights };
    } catch {
        return fallbackAnswer(rows);
    }
}
