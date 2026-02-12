const DISALLOWED_SQL = /\b(insert|update|delete|drop|alter|create|attach|detach|pragma|vacuum|truncate|replace|grant|revoke)\b/i;

function stripSqlComments(sql: string): string {
    return sql
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/--.*$/gm, ' ')
        .trim();
}

export function assertSafeReadOnlySql(inputSql: string): string {
    const trimmed = inputSql.trim();
    if (!trimmed) {
        throw new Error('Generated SQL is empty');
    }

    const sqlWithoutTrailingSemicolon = trimmed.replace(/;+\s*$/, '');
    const normalizedSql = stripSqlComments(sqlWithoutTrailingSemicolon);

    if (!/^(select|with)\b/i.test(normalizedSql)) {
        throw new Error('Only SELECT/CTE queries are allowed');
    }

    if (DISALLOWED_SQL.test(normalizedSql)) {
        throw new Error('Unsafe SQL detected');
    }

    if (normalizedSql.includes(';')) {
        throw new Error('Only one SQL statement is allowed');
    }

    return sqlWithoutTrailingSemicolon;
}

export function extractTableNames(sql: string): string[] {
    const tableMatches = sql.matchAll(/\b(?:from|join)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi);
    const names = new Set<string>();

    for (const match of tableMatches) {
        if (match[1]) {
            names.add(match[1].toLowerCase());
        }
    }

    return Array.from(names);
}
