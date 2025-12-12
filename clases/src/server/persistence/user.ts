import { PaginatedUsers, User } from "@shared/user";
import { SQL, and, eq, gt, ilike } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { defaultPool } from "./index";
import * as schema from "./schema";

export const getUser = async (
  filters: { id?: string; username?: string },
  options: { getTeacher?: boolean } = {},
  pool: Pool = defaultPool
): Promise<User | null> => {
  if (!filters.id && !filters.username) {
    throw new Error("At least one filter (id or username) must be provided");
  }

  const db = drizzle(pool, { schema });

  const conditions: SQL[] = [];
  if (filters.id) {
    conditions.push(eq(schema.users.id, filters.id));
  }
  if (filters.username) {
    conditions.push(eq(schema.users.username, filters.username));
  }

  const whereClause =
    conditions.length === 1 ? conditions[0] : and(...conditions);

  const fields: any = {
    id: schema.users.id,
    username: schema.users.username,
  };

  if (options.getTeacher) {
    fields.teacher = schema.teachers;
  }

  let query: any = db.select(fields).from(schema.users);

  if (options.getTeacher) {
    query = query.leftJoin(
      schema.teachers,
      eq(schema.users.id, schema.teachers.userId)
    );
  }

  query = query.where(whereClause).limit(1);

  const result = await query;

  if (result.length === 0) {
    return null;
  }

  return result[0] as User;
};

export const getUsers = async (
  filters: { usernameContains?: string; onlyTeachers?: boolean },
  options: {
    pageSize?: number;
    cursor?: string | null;
    getTeachersInfo?: boolean;
  },
  pool: Pool = defaultPool
): Promise<PaginatedUsers> => {
  const pageSize = options.pageSize ?? 20;
  const db = drizzle(pool, { schema });

  const conditions: SQL[] = [];

  if (options.cursor) {
    const decodedCursor = Buffer.from(options.cursor, "base64").toString(
      "utf-8"
    );
    conditions.push(gt(schema.users.id, decodedCursor));
  }

  if (filters.usernameContains && filters.usernameContains.trim() !== "") {
    conditions.push(
      ilike(schema.users.username, `%${filters.usernameContains}%`)
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const fields: any = {
    id: schema.users.id,
    username: schema.users.username,
  };

  if (options.getTeachersInfo || filters.onlyTeachers) {
    fields.teacher = schema.teachers;
  }

  let query: any = db.select(fields).from(schema.users);

  if (options.getTeachersInfo || filters.onlyTeachers) {
    if (filters.onlyTeachers) {
      query = query.innerJoin(
        schema.teachers,
        eq(schema.users.id, schema.teachers.userId)
      );
    } else {
      query = query.leftJoin(
        schema.teachers,
        eq(schema.users.id, schema.teachers.userId)
      );
    }
  }

  if (whereClause) {
    query = query.where(whereClause);
  }

  query = query.orderBy(schema.users.id).limit(pageSize + 1);

  const result = await query;

  const hasNextPage = result.length === pageSize + 1;
  const users = hasNextPage ? result.slice(0, pageSize) : result;
  const nextPageCursor = hasNextPage
    ? Buffer.from(result[pageSize].id).toString("base64")
    : null;

  return {
    users: users as User[],
    nextPageCursor,
  };
};
