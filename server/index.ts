import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { analyticsDatabase } from './database.ts';
import { getLlmModel, getLlmProvider, isLlmConfigured } from './llmClient.ts';
import { runSqlAgent } from './sqlAgentService.ts';
import type { SqlAgentRequest } from './types.ts';

const app = express();
const port = Number(process.env.API_PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
    await analyticsDatabase.init();
    res.json({
        ok: true,
        service: 'askq-sql-agent',
        llmProvider: getLlmProvider(),
        llmModel: getLlmModel(),
        llmConfigured: isLlmConfigured(),
        fallbackEnabled: process.env.SQL_AGENT_ALLOW_FALLBACK === 'true',
        timestamp: new Date().toISOString(),
    });
});

app.post('/api/sql-agent/query', async (req, res) => {
    try {
        const body = req.body as SqlAgentRequest;
        const question = typeof body.question === 'string' ? body.question : '';

        if (!question.trim()) {
            res.status(400).json({ error: 'question is required' });
            return;
        }

        const result = await runSqlAgent(question, body.maxRows);
        res.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: message });
    }
});

async function start(): Promise<void> {
    await analyticsDatabase.init();
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`AskQ SQL agent API listening on http://localhost:${port}`);
    });
}

start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start API server:', error);
    process.exit(1);
});
