export interface SqlAgentRequest {
    question: string;
    maxRows?: number;
}

export interface SqlAgentResponse {
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

export interface QueryExecutionResult {
    columns: string[];
    rows: Record<string, unknown>[];
}

export interface SqlGenerationResult {
    title: string;
    sql: string;
    tablesUsed: string[];
    confidence: number;
    followUps: string[];
}
