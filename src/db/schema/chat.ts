import { pgTable, foreignKey, unique, serial, timestamp, text, bigserial, bigint, boolean, integer } from "drizzle-orm/pg-core";
import { participantRole } from "./enums";

export const community = pgTable("community", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  jid: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  name: text().notNull(),
}, (table) => [unique("community_jid_unique").on(table.jid)]);

export const group = pgTable("group", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  jid: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  name: text().notNull(),
  communityId: bigint("community_id", { mode: "number" }),
  isAnnouncement: boolean("is_announcement").default(false).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.communityId],
    foreignColumns: [community.id],
    name: "group_community_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  unique("group_jid_unique").on(table.jid),
]);

export const contact = pgTable("contact", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  jid: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  pushName: text("push_name"),
  customName: text("custom_name"),
  confessTarget: integer("confess_target"),
}, (table) => [
  foreignKey({
    columns: [table.confessTarget],
    foreignColumns: [group.id],
    name: "contact_confess_group_fk",
  }).onUpdate("cascade").onDelete("set null"),
  unique("contact_jid_unique").on(table.jid),
]);

export const participant = pgTable("participant", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  groupId: bigint("group_id", { mode: "number" }).notNull(),
  contactId: bigint("contact_id", { mode: "number" }).notNull(),
  role: participantRole().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.groupId],
    foreignColumns: [group.id],
    name: "participant_group_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.contactId],
    foreignColumns: [contact.id],
    name: "participant_contact_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  unique("participant_contact_group_unique").on(table.contactId, table.groupId),
]);

export const voRequest = pgTable("vo_request", {
  id: serial().primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  chatJid: text("chat_jid").notNull(),
  messageId: text("message_id").notNull(),
  requesterJid: text("requester_jid").notNull(),
  messageOwnerJid: text("message_owner_jid").notNull(),
  approvalMessageId: text("approval_message_id").notNull(),
  accepted: boolean(),
  url: text(),
  directPath: text("direct_path"),
  mediaKey: text("media_key").notNull(),
  fileSha256: text("file_sha256").notNull(),
  fileEncSha256: text("file_enc_sha256").notNull(),
  mediaType: text("media_type").notNull(),
}, (table) => [unique("vo_message_unique").on(table.chatJid, table.messageId)]);
