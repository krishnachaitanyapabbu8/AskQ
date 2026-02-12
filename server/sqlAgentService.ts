import { analyticsDatabase } from './database.ts';
import { generateSqlWithLlm, synthesizeAnswerWithLlm } from './llmClient.ts';
import { assertSafeReadOnlySql, extractTableNames } from './sqlGuard.ts';
import type { SqlAgentResponse } from './types.ts';

const DEFAULT_MAX_ROWS = 50;
const MAX_ALLOWED_ROWS = 200;

function normalizeMaxRows(input?: number): number {
    if (!input || Number.isNaN(input)) {
        return DEFAULT_MAX_ROWS;
    }
    return Math.min(MAX_ALLOWED_ROWS, Math.max(1, Math.floor(input)));
}

export async function runSqlAgent(question: string, maxRows?: number): Promise<SqlAgentResponse> {
    await analyticsDatabase.init();

    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) {
        throw new Error('Question is required');
    }

    const limit = normalizeMaxRows(maxRows);
    const { result: sqlPlan, usedFallbackModel } = await generateSqlWithLlm(
        normalizedQuestion,
        analyticsDatabase.getSchemaDescription(),
    );

    const safeSql = assertSafeReadOnlySql(sqlPlan.sql);
    const queryResult = analyticsDatabase.runQuery(safeSql, limit);
    const answerPayload = await synthesizeAnswerWithLlm(normalizedQuestion, safeSql, queryResult.rows);
    const tablesUsed = sqlPlan.tablesUsed.length > 0 ? sqlPlan.tablesUsed : extractTableNames(safeSql);

    return {
        title: sqlPlan.title,
        answer: answerPayload.answer,
        sql: safeSql,
        tablesUsed,
        confidence: sqlPlan.confidence,
        table: {
            columns: queryResult.columns,
            rows: queryResult.rows,
        },
        insights: answerPayload.insights,
        followUps: sqlPlan.followUps,
        usedFallbackModel,
    };
}
