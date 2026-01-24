export interface Migration {
    name: string;
    sql: string;
}

export const migrations: Migration[] = [
    {
        name: "000_enable_pgcrypto",
        sql: `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `,
    },
    {
        name: "001_create_entries_table",
        sql: `
      CREATE TABLE IF NOT EXISTS entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `,
    },
];
