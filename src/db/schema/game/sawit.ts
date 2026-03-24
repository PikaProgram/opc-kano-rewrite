import { pgTable, timestamp, text, foreignKey, unique, integer, serial, boolean, bigint } from "drizzle-orm/pg-core";
import { participant, group } from "../chat";

export const sawit = pgTable("sawit", {
  participantId: bigint("participant_id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  lastGrowDate: text("last_grow_date").notNull(),
  height: integer().default(0).notNull(),
  attackTotal: integer("attack_total").default(0).notNull(),
  attackWin: integer("attack_win").default(0).notNull(),
  attackAcquiredHeight: integer("attack_acquired_height").default(0).notNull(),
  attackLostHeight: integer("attack_lost_height").default(0).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.participantId],
    foreignColumns: [participant.id],
    name: "sawit_participant_fk",
  }),
]);

export const sawitAttack = pgTable("sawit_attack", {
  id: serial().primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  participantId: bigint("participant_id", { mode: "number" }).notNull(),
  groupId: bigint("group_id", { mode: "number" }).notNull(),
  messageId: text("message_id").notNull(),
  attackSize: integer("attack_size").notNull(),
  acceptedBy: bigint("accepted_by", { mode: "number" }),
  isAttackerWin: boolean("is_attacker_win"),
}, (table) => [
  foreignKey({
    columns: [table.groupId],
    foreignColumns: [group.id],
    name: "sawitattack_group_fk",
  }),
  foreignKey({
    columns: [table.participantId],
    foreignColumns: [participant.id],
    name: "sawitattack_participant_fk",
  }),
  foreignKey({
    columns: [table.acceptedBy],
    foreignColumns: [participant.id],
    name: "sawitattack_accepted_participant_fk",
  }),
  unique("sawitattack_unique").on(table.groupId, table.messageId),
]);