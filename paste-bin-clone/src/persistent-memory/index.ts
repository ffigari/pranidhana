import { Entry, EntryID, EntryCreationRequest } from "@domain/entry";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { entries } from "./schema";
import { migrations } from "./migrations";

export class PersistentMemory {
    private db;

    constructor(private pool: Pool) {
        this.db = drizzle(pool);
    }

    async getEntryByID(id: EntryID): Promise<Entry | null> {
        const result = await this.db
            .select()
            .from(entries)
            .where(eq(entries.id, id))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        const row = result[0];
        return {
            id: row.id,
            text: row.text,
            createdAt: row.createdAt,
        };
    }

    async create(request: EntryCreationRequest): Promise<EntryID> {
        const result = await this.db
            .insert(entries)
            .values({
                text: request.text,
            })
            .returning({ id: entries.id });

        return result[0].id;
    }

    async runMigrations(): Promise<void> {
        // Create migrations tracking table if it doesn't exist
        await this.pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

        // Get list of already applied migrations
        const appliedResult = await this.pool.query<{ name: string }>(
            "SELECT name FROM _migrations ORDER BY name"
        );
        const appliedMigrations = new Set(
            appliedResult.rows.map((row) => row.name)
        );

        // Run pending migrations in order
        for (const migration of migrations) {
            if (!appliedMigrations.has(migration.name)) {
                console.log(`Running migration: ${migration.name}`);
                await this.pool.query(migration.sql);
                await this.pool.query(
                    "INSERT INTO _migrations (name) VALUES ($1)",
                    [migration.name]
                );
                console.log(`Completed migration: ${migration.name}`);
            }
        }

        console.log("All migrations completed");
    }
}
