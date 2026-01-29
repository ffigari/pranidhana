import { Pool } from "pg";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import { userInfo } from "os";

import { PostgresDB } from "@core/postgres/dbs/postgres";

const get = (): { port: number; password: string } => {
  const homeDir = userInfo().homedir;
  const envPath = resolve(homeDir, ".pranidhana.env");
  if (!existsSync(envPath)) {
    throw new Error(
      `.pranidhana.env file not found at ${envPath}. Please create a .pranidhana.env file with the required environment variables [PGPORT, PGPASSWORD].`
    );
  }
  process.env.DOTENV_CONFIG_QUIET = "true";
  dotenv.config({ path: envPath, override: false });

  const requiredVars = ["PGPORT", "PGPASSWORD"];
  const missingVars = requiredVars.filter((varName) => process.env[varName] === undefined);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. Please check your .env file.`
    );
  }

  return {
    port: parseInt(process.env.PGPORT!),
    password: process.env.PGPASSWORD ?? "",
  };
};

export class PostgresServer {
  getPostgresDB() {
    const { port, password } = get();

    const pool = new Pool({
      host: "localhost",
      port,
      database: "postgres",
      user: "syncher",
      password,
    });

    return new PostgresDB(pool, port);
  }
}

export const server = new PostgresServer();
