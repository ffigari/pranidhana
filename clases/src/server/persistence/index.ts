import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export const defaultPool = new Pool({
  user: process.env.PGUSER || "figari",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "clases",
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432", 10),
});

export const db = drizzle(defaultPool, { schema });

export { users, teachers } from "./schema";
