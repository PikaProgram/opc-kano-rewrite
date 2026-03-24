import { bigint, boolean, foreignKey, pgTable } from "drizzle-orm/pg-core";
import { group } from "../chat";

export const groupSettings = pgTable("group_settings", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  isGameAllowed: boolean("is_game_allowed").default(false).notNull(),
  isConfessAllowed: boolean("is_confess_allowed").default(false).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.id],
    foreignColumns: [group.id],
    name: "group_settings_fk",
  }),
]);

export * from "./sawit";
export * from "./wordle";