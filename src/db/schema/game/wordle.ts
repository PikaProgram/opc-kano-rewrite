import { bigint, boolean, foreignKey, integer, pgTable, serial, text, unique, varchar } from "drizzle-orm/pg-core";
import { contact } from "../chat";

export const wordle = pgTable("wordle", {
  id: serial().primaryKey().notNull(),
  word: text().notNull(),
  point: integer().notNull(),
  lang: varchar({ length: 5 }).notNull(),
  isWordle: boolean("is_wordle").default(false).notNull(),
}, (table) => [unique("wordle_word_unique").on(table.lang, table.word)]);

export const userWordle = pgTable("user_wordle", {
  id: serial().primaryKey().notNull(),
  targetId: integer("target_id").notNull(),
  guesses: text().array().notNull(),
  dateStr: text("date_str").notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [contact.id],
    name: "user_wordle_contact_fk",
  }),
  foreignKey({
    columns: [table.targetId],
    foreignColumns: [wordle.id],
    name: "user_wordle_wordle_fk",
  }),
  unique("user_wordle_unique").on(table.dateStr, table.userId),
]);

  