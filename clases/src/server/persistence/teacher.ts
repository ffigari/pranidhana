import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { defaultPool } from "./index";
import * as schema from "./schema";

export const registerTeacher = async (
  userId: string,
  pool: Pool = defaultPool
): Promise<void> => {
  const db = drizzle(pool, { schema });

  await db.insert(schema.teachers).values({ userId }).onConflictDoNothing();
};
