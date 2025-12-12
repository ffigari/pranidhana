import { userHasTeacherInfo, userIsTeacher } from "@shared/user";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { TestDatabase } from "../test-utils/db-setup";
import * as schema from "./schema";
import { getUser, getUsers } from "./user";

describe("user persistence", () => {
  describe.concurrent("getUser", () => {
    let testDb: TestDatabase;
    let pool: Pool;

    beforeAll(async () => {
      testDb = new TestDatabase("persistence_user_getuser");
      pool = await testDb.setup();
    });

    afterAll(async () => {
      await testDb.cleanup();
    });

    it("should throw error when no filters provided", async () => {
      await expect(getUser({}, {}, pool)).rejects.toThrow(
        "At least one filter (id or username) must be provided"
      );
    });

    it("should return user when filtering by username", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "testuser" })
        .returning({ id: schema.users.id, username: schema.users.username });
      const insertedUser = insertResult[0];

      const user = await getUser({ username: "testuser" }, {}, pool);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(insertedUser.id);
      expect(user?.username).toBe("testuser");
      expect(userHasTeacherInfo(user!)).toBe(false);
    });

    it("should return user when filtering by id", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "userbyid" })
        .returning({ id: schema.users.id });
      const userId = insertResult[0].id;

      const user = await getUser({ id: userId }, {}, pool);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userId);
      expect(user?.username).toBe("userbyid");
      expect(userHasTeacherInfo(user!)).toBe(false);
    });

    it("should return user when filtering by both id and username", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "bothfilters" })
        .returning({ id: schema.users.id, username: schema.users.username });
      const insertedUser = insertResult[0];

      const user = await getUser(
        { id: insertedUser.id, username: "bothfilters" },
        {},
        pool
      );

      expect(user).not.toBeNull();
      expect(user?.id).toBe(insertedUser.id);
      expect(user?.username).toBe("bothfilters");
      expect(userHasTeacherInfo(user!)).toBe(false);
    });

    it("should return null when username does not exist", async () => {
      const user = await getUser({ username: "nonexistent" }, {}, pool);

      expect(user).toBeNull();
    });

    it("should return null when id does not exist", async () => {
      const user = await getUser(
        { id: "00000000-0000-0000-0000-000000000000" },
        {},
        pool
      );

      expect(user).toBeNull();
    });

    it("should return user with teacher info when getTeacher is true for non-teacher", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "regularuser" })
        .returning({ id: schema.users.id });
      const userId = insertResult[0].id;

      const user = await getUser({ id: userId }, { getTeacher: true }, pool);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userId);
      expect(user?.username).toBe("regularuser");
      expect(userHasTeacherInfo(user!)).toBe(true);
      expect(userIsTeacher(user!)).toBe(false);
    });

    it("should return user with teacher info when user is a teacher and getTeacher is true", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "teacheruser" })
        .returning({ id: schema.users.id });
      const userId = insertResult[0].id;

      await db.insert(schema.teachers).values({ userId });

      const user = await getUser({ id: userId }, { getTeacher: true }, pool);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userId);
      expect(user?.username).toBe("teacheruser");
      expect(userHasTeacherInfo(user!)).toBe(true);
      expect(userIsTeacher(user!)).toBe(true);
    });

    it("should return user without teacher info when getTeacher is false even if user is a teacher", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values({ username: "teacheruser2" })
        .returning({ id: schema.users.id });
      const userId = insertResult[0].id;

      await db.insert(schema.teachers).values({ userId });

      const user = await getUser({ id: userId }, { getTeacher: false }, pool);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userId);
      expect(user?.username).toBe("teacheruser2");
      expect(userHasTeacherInfo(user!)).toBe(false);
    });
  });

  describe.concurrent("getUsers", () => {
    let testDb: TestDatabase;
    let pool: Pool;

    beforeAll(async () => {
      testDb = new TestDatabase("persistence_user_getusers");
      pool = await testDb.setup();
    });

    afterAll(async () => {
      await testDb.cleanup();
    });

    it("should return first page of users without filters", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([
          { username: "page_user1" },
          { username: "page_user2" },
          { username: "page_user3" },
        ])
        .returning({ id: schema.users.id, username: schema.users.username });

      const sortedUsers = insertResult.sort((a, b) => a.id.localeCompare(b.id));

      const result = await getUsers({}, { pageSize: 2 }, pool);

      expect(result.users.length).toBe(2);
      expect(result.users[0].id).toBe(sortedUsers[0].id);
      expect(result.users[1].id).toBe(sortedUsers[1].id);
      expect(result.nextPageCursor).not.toBeNull();

      for (const user of sortedUsers) {
        await db.delete(schema.users).where(eq(schema.users.id, user.id));
      }
    });

    it("should return users filtered by username", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([
          { username: "alice" },
          { username: "bob" },
          { username: "alicia" },
        ])
        .returning({ id: schema.users.id, username: schema.users.username });

      const result = await getUsers({ usernameContains: "ali" }, {}, pool);

      expect(result.users.length).toBe(2);
      const usernames = result.users.map((u) => u.username).sort();
      expect(usernames).toEqual(["alice", "alicia"]);

      for (const user of insertResult) {
        await db.delete(schema.users).where(eq(schema.users.id, user.id));
      }
    });

    it("should paginate using cursor", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([
          { username: "cursor_user1" },
          { username: "cursor_user2" },
          { username: "cursor_user3" },
        ])
        .returning({ id: schema.users.id, username: schema.users.username });

      const sortedUsers = insertResult.sort((a, b) => a.id.localeCompare(b.id));

      const firstPage = await getUsers({}, { pageSize: 2 }, pool);
      expect(firstPage.users.length).toBe(2);
      expect(firstPage.nextPageCursor).not.toBeNull();

      const secondPage = await getUsers(
        {},
        { pageSize: 2, cursor: firstPage.nextPageCursor },
        pool
      );

      expect(secondPage.users.length).toBeGreaterThanOrEqual(1);
      const firstPageIds = firstPage.users.map((u) => u.id);
      const secondPageIds = secondPage.users.map((u) => u.id);
      expect(firstPageIds).not.toContain(secondPageIds[0]);

      for (const user of sortedUsers) {
        await db.delete(schema.users).where(eq(schema.users.id, user.id));
      }
    });

    it("should return null cursor when no more pages", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([
          { username: "nomorepages_user1" },
          { username: "nomorepages_user2" },
        ])
        .returning({ id: schema.users.id });

      const result = await getUsers(
        { usernameContains: "nomorepages" },
        { pageSize: 5 },
        pool
      );

      expect(result.users.length).toBe(2);
      expect(result.nextPageCursor).toBeNull();

      for (const user of insertResult) {
        await db.delete(schema.users).where(eq(schema.users.id, user.id));
      }
    });

    it("should include teacher info when getTeachersInfo is true", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([
          { username: "teacherinfo_teacher1" },
          { username: "teacherinfo_student1" },
        ])
        .returning({ id: schema.users.id });

      await db.insert(schema.teachers).values({ userId: insertResult[0].id });

      const result = await getUsers(
        { usernameContains: "teacherinfo" },
        { getTeachersInfo: true },
        pool
      );

      expect(result.users.length).toBe(2);
      expect(userHasTeacherInfo(result.users[0])).toBe(true);
      expect(userHasTeacherInfo(result.users[1])).toBe(true);

      const teacherUsers = result.users.filter((u) => userIsTeacher(u));
      const nonTeacherUsers = result.users.filter((u) => !userIsTeacher(u));
      expect(teacherUsers.length).toBe(1);
      expect(nonTeacherUsers.length).toBe(1);

      await db
        .delete(schema.teachers)
        .where(eq(schema.teachers.userId, insertResult[0].id));
      for (const user of insertResult) {
        await db.delete(schema.users).where(eq(schema.users.id, user.id));
      }
    });

    it("should not include teacher info when getTeachersInfo is false", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([{ username: "noteacherinfo_user1" }])
        .returning({ id: schema.users.id });

      const result = await getUsers(
        { usernameContains: "noteacherinfo" },
        {},
        pool
      );

      expect(result.users.length).toBe(1);
      expect(userHasTeacherInfo(result.users[0])).toBe(false);

      await db
        .delete(schema.users)
        .where(eq(schema.users.id, insertResult[0].id));
    });

    it("should return only teachers when onlyTeachers is true", async () => {
      const db = drizzle(pool, { schema });
      const insertResult = await db
        .insert(schema.users)
        .values([
          { username: "onlyteachers_teacher1" },
          { username: "onlyteachers_student1" },
          { username: "onlyteachers_teacher2" },
        ])
        .returning({ id: schema.users.id });

      await db.insert(schema.teachers).values({ userId: insertResult[0].id });
      await db.insert(schema.teachers).values({ userId: insertResult[2].id });

      const result = await getUsers(
        { usernameContains: "onlyteachers", onlyTeachers: true },
        {},
        pool
      );

      expect(result.users.length).toBe(2);
      expect(userHasTeacherInfo(result.users[0])).toBe(true);
      expect(userHasTeacherInfo(result.users[1])).toBe(true);
      expect(userIsTeacher(result.users[0])).toBe(true);
      expect(userIsTeacher(result.users[1])).toBe(true);

      await db
        .delete(schema.teachers)
        .where(eq(schema.teachers.userId, insertResult[0].id));
      await db
        .delete(schema.teachers)
        .where(eq(schema.teachers.userId, insertResult[2].id));
      for (const user of insertResult) {
        await db.delete(schema.users).where(eq(schema.users.id, user.id));
      }
    });
  });
});
