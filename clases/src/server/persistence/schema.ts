import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username").notNull().unique(),
});

export const teachers = pgTable("teachers", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const dojos = pgTable("dojos", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
});

export const dojosTeachers = pgTable(
  "dojos_teachers",
  {
    dojoId: uuid("dojo_id")
      .notNull()
      .references(() => dojos.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.userId, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.dojoId, table.teacherId] }),
  })
);

export const dojosAdmins = pgTable(
  "dojos_admins",
  {
    dojoId: uuid("dojo_id")
      .notNull()
      .references(() => dojos.id, { onDelete: "cascade" }),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.dojoId, table.adminId] }),
  })
);
