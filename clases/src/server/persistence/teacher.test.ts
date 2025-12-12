import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { TestDatabase } from "../test-utils/db-setup";
import * as schema from "./schema";
import { registerTeacher } from "./teacher";

describe("teacher persistence", () => {
  describe.concurrent("registerTeacher", () => {
    let testDb: TestDatabase;
    let pool: Pool;

    beforeAll(async () => {
      testDb = new TestDatabase("persistence_teacher_registerteacher");
      pool = await testDb.setup();
    });

    afterAll(async () => {
      await testDb.cleanup();
    });

    it("should register a user as a teacher", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "newteacher" })
        .returning({ id: schema.users.id });
      const userId = insertResult[0].id;

      await registerTeacher(userId, pool);

      const result = await db
        .select()
        .from(schema.teachers)
        .where(eq(schema.teachers.userId, userId));

      expect(result.length).toBe(1);
      expect(result[0].userId).toBe(userId);
    });

    it("should not fail when registering the same user twice", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "duplicateteacher" })
        .returning({ id: schema.users.id });
      const userId = insertResult[0].id;

      await registerTeacher(userId, pool);
      await registerTeacher(userId, pool);

      const result = await db
        .select()
        .from(schema.teachers)
        .where(eq(schema.teachers.userId, userId));

      expect(result.length).toBe(1);
    });
  });
});
