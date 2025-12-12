import { DojoWithUsers, errorCodes, isValidDojoName } from "@shared/dojo";
import { asc, desc, eq, gt, inArray, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { defaultPool } from "./index";
import * as schema from "./schema";

interface PaginatedDojos {
  page: DojoWithUsers[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const createDojo = async (
  {
    name,
    teacherIds,
    adminIds,
  }: {
    name: string;
    teacherIds: string[];
    adminIds: string[];
  },
  pool: Pool = defaultPool
): Promise<{ id: string }> => {
  if (!name || name.trim() === "") {
    throw new Error(errorCodes.nameRequired);
  }

  if (!isValidDojoName(name.trim())) {
    throw new Error(errorCodes.invalidNameFormat);
  }

  if (adminIds.length === 0) {
    throw new Error(errorCodes.noAdmins);
  }

  const db = drizzle(pool, { schema });

  const existingDojo = await db
    .select()
    .from(schema.dojos)
    .where(eq(schema.dojos.name, name.trim()))
    .limit(1);

  if (existingDojo.length > 0) {
    throw new Error(errorCodes.nameTaken);
  }

  if (teacherIds.length > 0) {
    const teachers = await db
      .select()
      .from(schema.teachers)
      .where(inArray(schema.teachers.userId, teacherIds));

    if (teachers.length !== teacherIds.length) {
      throw new Error(errorCodes.invalidTeacherId);
    }
  }

  const users = await db
    .select()
    .from(schema.users)
    .where(inArray(schema.users.id, adminIds));

  if (users.length !== adminIds.length) {
    throw new Error(errorCodes.invalidAdminId);
  }

  return await db.transaction(async (tx) => {
    const [dojo] = await tx
      .insert(schema.dojos)
      .values({ name: name.trim() })
      .returning({ id: schema.dojos.id });

    if (teacherIds.length > 0) {
      await tx.insert(schema.dojosTeachers).values(
        teacherIds.map((teacherId) => ({
          dojoId: dojo.id,
          teacherId,
        }))
      );
    }

    await tx.insert(schema.dojosAdmins).values(
      adminIds.map((adminId) => ({
        dojoId: dojo.id,
        adminId,
      }))
    );

    return { id: dojo.id };
  });
};

export const getDojo = async (
  dojoId: string,
  pool: Pool = defaultPool
): Promise<DojoWithUsers> => {
  const db = drizzle(pool, { schema });

  const dojo = await db
    .select()
    .from(schema.dojos)
    .where(eq(schema.dojos.id, dojoId))
    .limit(1);

  if (dojo.length === 0) {
    throw new Error(errorCodes.dojoNotFound);
  }

  const teachersQuery = db
    .select({
      userId: schema.users.id,
      username: schema.users.username,
      isTeacher: sql<boolean>`true`.as("is_teacher"),
      role: sql<string>`'teacher'`.as("role"),
    })
    .from(schema.dojosTeachers)
    .innerJoin(
      schema.users,
      eq(schema.dojosTeachers.teacherId, schema.users.id)
    )
    .where(eq(schema.dojosTeachers.dojoId, dojoId));

  const adminsQuery = db
    .select({
      userId: schema.users.id,
      username: schema.users.username,
      isTeacher:
        sql<boolean>`EXISTS(SELECT 1 FROM teachers WHERE user_id = ${schema.users.id})`.as(
          "is_teacher"
        ),
      role: sql<string>`'admin'`.as("role"),
    })
    .from(schema.dojosAdmins)
    .innerJoin(schema.users, eq(schema.dojosAdmins.adminId, schema.users.id))
    .where(eq(schema.dojosAdmins.dojoId, dojoId));

  const result = await teachersQuery.union(adminsQuery);

  const teachers = [];
  const admins = [];

  for (const row of result) {
    const user = {
      id: row.userId,
      username: row.username,
      teacher: row.isTeacher ? {} : null,
    };

    if (row.role === "teacher") {
      teachers.push(user);
    } else if (row.role === "admin") {
      admins.push(user);
    }
  }

  return {
    id: dojo[0].id,
    name: dojo[0].name,
    teachers,
    admins,
  };
};

export const updateDojo = async (
  {
    dojoId,
    name,
    teacherIds,
    adminIds,
  }: {
    dojoId: string;
    name?: string;
    teacherIds?: string[];
    adminIds?: string[];
  },
  pool: Pool = defaultPool
): Promise<void> => {
  const db = drizzle(pool, { schema });

  const existingDojo = await db
    .select()
    .from(schema.dojos)
    .where(eq(schema.dojos.id, dojoId))
    .limit(1);

  if (existingDojo.length === 0) {
    throw new Error(errorCodes.dojoNotFound);
  }

  if (name !== undefined) {
    if (!name || name.trim() === "") {
      throw new Error(errorCodes.nameRequired);
    }

    if (!isValidDojoName(name.trim())) {
      throw new Error(errorCodes.invalidNameFormat);
    }

    const dojoWithSameName = await db
      .select()
      .from(schema.dojos)
      .where(eq(schema.dojos.name, name.trim()))
      .limit(1);

    if (dojoWithSameName.length > 0 && dojoWithSameName[0].id !== dojoId) {
      throw new Error(errorCodes.nameTaken);
    }
  }

  if (teacherIds !== undefined && teacherIds.length > 0) {
    const teachers = await db
      .select()
      .from(schema.teachers)
      .where(inArray(schema.teachers.userId, teacherIds));

    if (teachers.length !== teacherIds.length) {
      throw new Error(errorCodes.invalidTeacherId);
    }
  }

  if (adminIds !== undefined) {
    if (adminIds.length === 0) {
      throw new Error(errorCodes.noAdmins);
    }

    const users = await db
      .select()
      .from(schema.users)
      .where(inArray(schema.users.id, adminIds));

    if (users.length !== adminIds.length) {
      throw new Error(errorCodes.invalidAdminId);
    }
  }

  await db.transaction(async (tx) => {
    if (name !== undefined) {
      await tx
        .update(schema.dojos)
        .set({ name: name.trim() })
        .where(eq(schema.dojos.id, dojoId));
    }

    if (teacherIds !== undefined) {
      await tx
        .delete(schema.dojosTeachers)
        .where(eq(schema.dojosTeachers.dojoId, dojoId));

      if (teacherIds.length > 0) {
        await tx.insert(schema.dojosTeachers).values(
          teacherIds.map((teacherId) => ({
            dojoId,
            teacherId,
          }))
        );
      }
    }

    if (adminIds !== undefined) {
      await tx
        .delete(schema.dojosAdmins)
        .where(eq(schema.dojosAdmins.dojoId, dojoId));

      await tx.insert(schema.dojosAdmins).values(
        adminIds.map((adminId) => ({
          dojoId,
          adminId,
        }))
      );
    }
  });
};

export const getDojos = async (
  {
    pageSize,
    afterID,
    beforeID,
  }: {
    pageSize: number;
    afterID?: string;
    beforeID?: string;
  },
  pool: Pool = defaultPool
): Promise<PaginatedDojos> => {
  if (afterID !== undefined && beforeID !== undefined) {
    throw new Error("Cannot specify both afterID and beforeID");
  }

  const db = drizzle(pool, { schema });

  let dojos;
  let hasPreviousPage = false;
  let hasNextPage = false;

  if (afterID !== undefined) {
    dojos = await db
      .select()
      .from(schema.dojos)
      .where(gt(schema.dojos.id, afterID))
      .orderBy(asc(schema.dojos.id))
      .limit(pageSize + 1);

    hasPreviousPage = true;
    hasNextPage = dojos.length > pageSize;
  } else if (beforeID !== undefined) {
    dojos = await db
      .select()
      .from(schema.dojos)
      .where(lt(schema.dojos.id, beforeID))
      .orderBy(desc(schema.dojos.id))
      .limit(pageSize + 1);

    hasPreviousPage = dojos.length > pageSize;
    hasNextPage = true;
  } else {
    dojos = await db
      .select()
      .from(schema.dojos)
      .orderBy(asc(schema.dojos.id))
      .limit(pageSize + 1);

    hasPreviousPage = false;
    hasNextPage = dojos.length > pageSize;
  }

  const resultDojos = dojos.slice(0, pageSize);

  if (beforeID !== undefined) {
    resultDojos.reverse();
  }

  const dojoIds = resultDojos.map((d) => d.id);

  if (dojoIds.length === 0) {
    return {
      page: [],
      hasNextPage,
      hasPreviousPage,
    };
  }

  const teachersQuery = db
    .select({
      dojoId: schema.dojosTeachers.dojoId,
      userId: schema.users.id,
      username: schema.users.username,
      isTeacher: sql<boolean>`true`.as("is_teacher"),
    })
    .from(schema.dojosTeachers)
    .innerJoin(
      schema.users,
      eq(schema.dojosTeachers.teacherId, schema.users.id)
    )
    .where(inArray(schema.dojosTeachers.dojoId, dojoIds));

  const adminsQuery = db
    .select({
      dojoId: schema.dojosAdmins.dojoId,
      userId: schema.users.id,
      username: schema.users.username,
      isTeacher:
        sql<boolean>`EXISTS(SELECT 1 FROM teachers WHERE user_id = ${schema.users.id})`.as(
          "is_teacher"
        ),
    })
    .from(schema.dojosAdmins)
    .innerJoin(schema.users, eq(schema.dojosAdmins.adminId, schema.users.id))
    .where(inArray(schema.dojosAdmins.dojoId, dojoIds));

  const [teachers, admins] = await Promise.all([teachersQuery, adminsQuery]);

  const page: DojoWithUsers[] = resultDojos.map((dojo) => ({
    id: dojo.id,
    name: dojo.name,
    teachers: teachers
      .filter((t) => t.dojoId === dojo.id)
      .map((t) => ({
        id: t.userId,
        username: t.username,
        teacher: t.isTeacher ? {} : null,
      })),
    admins: admins
      .filter((a) => a.dojoId === dojo.id)
      .map((a) => ({
        id: a.userId,
        username: a.username,
        teacher: a.isTeacher ? {} : null,
      })),
  }));

  return {
    page,
    hasNextPage,
    hasPreviousPage,
  };
};
