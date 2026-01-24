import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
    id: uuid("id").primaryKey().defaultRandom(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
