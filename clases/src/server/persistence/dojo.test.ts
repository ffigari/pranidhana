import { errorCodes } from "@shared/dojo";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { TestDatabase } from "../test-utils/db-setup";
import { createDojo } from "./dojo";
import * as schema from "./schema";

describe("dojo persistence", () => {
  describe.concurrent("createDojo", () => {
    let testDb: TestDatabase;
    let pool: Pool;

    beforeAll(async () => {
      testDb = new TestDatabase("persistence_dojo_createdojo");
      pool = await testDb.setup();
    });

    afterAll(async () => {
      await testDb.cleanup();
    });

    it("should throw error when name is empty", async () => {
      const db = drizzle(pool, { schema });
      const [user] = await db
        .insert(schema.users)
        .values({ username: "admin1" })
        .returning({ id: schema.users.id });

      await expect(
        createDojo({ name: "", teacherIds: [], adminIds: [user.id] }, pool)
      ).rejects.toThrow(errorCodes.nameRequired);

      await expect(
        createDojo({ name: "   ", teacherIds: [], adminIds: [user.id] }, pool)
      ).rejects.toThrow(errorCodes.nameRequired);
    });

    it("should throw error when name is already taken", async () => {
      const db = drizzle(pool, { schema });
      const [user] = await db
        .insert(schema.users)
        .values({ username: "admin2" })
        .returning({ id: schema.users.id });

      await db.insert(schema.dojos).values({ name: "Existing Dojo" });

      await expect(
        createDojo(
          { name: "Existing Dojo", teacherIds: [], adminIds: [user.id] },
          pool
        )
      ).rejects.toThrow(errorCodes.nameTaken);
    });

    it("should throw error when teacher id is invalid", async () => {
      const db = drizzle(pool, { schema });
      const [user] = await db
        .insert(schema.users)
        .values({ username: "admin3" })
        .returning({ id: schema.users.id });

      const invalidTeacherId = "00000000-0000-0000-0000-000000000001";

      await expect(
        createDojo(
          {
            name: "Test Dojo",
            teacherIds: [invalidTeacherId],
            adminIds: [user.id],
          },
          pool
        )
      ).rejects.toThrow(errorCodes.invalidTeacherId);
    });

    it("should throw error when no admins provided", async () => {
      await expect(
        createDojo({ name: "Test Dojo", teacherIds: [], adminIds: [] }, pool)
      ).rejects.toThrow(errorCodes.noAdmins);
    });

    it("should throw error when admin id is invalid", async () => {
      const invalidAdminId = "00000000-0000-0000-0000-000000000002";

      await expect(
        createDojo(
          {
            name: "Test Dojo",
            teacherIds: [],
            adminIds: [invalidAdminId],
          },
          pool
        )
      ).rejects.toThrow(errorCodes.invalidAdminId);
    });

    it("should create dojo without teachers", async () => {
      const db = drizzle(pool, { schema });
      const [user] = await db
        .insert(schema.users)
        .values({ username: "admin4" })
        .returning({ id: schema.users.id });

      const result = await createDojo(
        { name: "No Teachers Dojo", teacherIds: [], adminIds: [user.id] },
        pool
      );

      expect(result.id).toBeDefined();

      const dojos = await db
        .select()
        .from(schema.dojos)
        .where(eq(schema.dojos.id, result.id));

      expect(dojos.length).toBe(1);
      expect(dojos[0].name).toBe("No Teachers Dojo");

      const admins = await db
        .select()
        .from(schema.dojosAdmins)
        .where(eq(schema.dojosAdmins.dojoId, result.id));

      expect(admins.length).toBe(1);
      expect(admins[0].adminId).toBe(user.id);

      const teachers = await db
        .select()
        .from(schema.dojosTeachers)
        .where(eq(schema.dojosTeachers.dojoId, result.id));

      expect(teachers.length).toBe(0);
    });

    it("should create dojo with teachers", async () => {
      const db = drizzle(pool, { schema });
      const [user1, user2, teacherUser] = await db
        .insert(schema.users)
        .values([
          { username: "admin5" },
          { username: "admin6" },
          { username: "teacher1" },
        ])
        .returning({ id: schema.users.id });

      await db.insert(schema.teachers).values({ userId: teacherUser.id });

      const result = await createDojo(
        {
          name: "With Teachers Dojo",
          teacherIds: [teacherUser.id],
          adminIds: [user1.id, user2.id],
        },
        pool
      );

      expect(result.id).toBeDefined();

      const dojos = await db
        .select()
        .from(schema.dojos)
        .where(eq(schema.dojos.id, result.id));

      expect(dojos.length).toBe(1);
      expect(dojos[0].name).toBe("With Teachers Dojo");

      const admins = await db
        .select()
        .from(schema.dojosAdmins)
        .where(eq(schema.dojosAdmins.dojoId, result.id));

      expect(admins.length).toBe(2);
      const adminIds = admins.map((a) => a.adminId).sort();
      expect(adminIds).toEqual([user1.id, user2.id].sort());

      const teachers = await db
        .select()
        .from(schema.dojosTeachers)
        .where(eq(schema.dojosTeachers.dojoId, result.id));

      expect(teachers.length).toBe(1);
      expect(teachers[0].teacherId).toBe(teacherUser.id);
    });
  });
});
