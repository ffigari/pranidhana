import { PersistentMemory } from "@persistent-memory";
import { Entries } from "@core/entries";
import { Pool } from "pg";
import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

const loadEnvVariables = (): void => {
    const envPath = resolve(process.cwd(), ".env");

    if (!existsSync(envPath)) {
        throw new Error(
            `.env file not found at ${envPath}. Please create a .env file with the required environment variables.`
        );
    }

    config();
};

const validateRequiredEnvVars = (): void => {
    const requiredVars = [
        "PGHOST",
        "PGPORT",
        "PGDATABASE",
        "PGUSER",
        "PGPASSWORD",
    ];
    const missingVars = requiredVars.filter(
        (varName) => process.env[varName] === undefined
    );

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(", ")}. Please check your .env file.`
        );
    }
};

const initializePersistentMemory = (): PersistentMemory => {
    loadEnvVariables();
    validateRequiredEnvVars();

    const pool = new Pool({
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT!),
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
    });

    return new PersistentMemory(pool);
};

export const bootstrap = async (): Promise<{
    persistentMemory: PersistentMemory;
    entries: Entries;
}> => {
    const persistentMemory = initializePersistentMemory();
    return {
        persistentMemory,
        entries: new Entries(persistentMemory),
    };
};
