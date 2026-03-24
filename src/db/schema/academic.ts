import { sql } from "drizzle-orm";
import { pgTable, foreignKey, serial, timestamp, integer, text, bigint, boolean, index, unique, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { campus, scheduleActivity, scheduleMethod, strata, subjectCategory } from "./enums";

export const students = pgTable("students", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
  nim: integer().notNull(),
  major: text().notNull(),
  faculty: text().notNull(),
  customName: text("custom_name"),
}, (table) => [
  index("student_custom_name_idx").using("gist", table.customName.asc().nullsLast().op("gist_trgm_ops")),
  index("student_name_idx").using("gist", table.name.asc().nullsLast().op("gist_trgm_ops")),
  unique("student_nim").on(table.nim),
  unique("students_id_key").on(table.id),
]);

export const semester = pgTable("semester", {
  id: serial().primaryKey().notNull(),
  year: integer().notNull(),
  semester: integer().notNull(),
  end: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  start: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("semester_year_semester_unique").using("btree", table.year.asc().nullsLast().op("int4_ops"), table.semester.asc().nullsLast().op("int4_ops")),
]);

export const major = pgTable("major", {
  id: integer().primaryKey().notNull(),
  name: text().notNull(),
  faculty: text().notNull(),
});

export const lecturer = pgTable("lecturer", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
}, (table) => [uniqueIndex("lecturer_name_unique").using("btree", table.name.asc().nullsLast().op("text_ops"))]);

export const constraintMajor = pgTable("constraint_major", {
  id: serial().primaryKey().notNull(),
  addonData: text("addon_data").notNull(),
  majorId: integer("major_id"),
}, (table) => [
  uniqueIndex("constraintMajor_addonData_majorId_unique").using("btree", table.addonData.asc().nullsLast().op("int4_ops"), table.majorId.asc().nullsLast().op("int4_ops")),
  foreignKey({
    columns: [table.majorId],
    foreignColumns: [major.id],
    name: "constraintMajor_classConstraint_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const edunexClassId = pgTable("edunex_class_id", {
  id: serial().primaryKey().notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" }).notNull(),
  semsCtx: text("sems_ctx").notNull(),
  subjectCode: text("subject_code").notNull(),
  classNum: integer("class_num").notNull(),
  classId: integer("class_id"),
}, (table) => [
  uniqueIndex("edunexclassid_semsCtx_subjectCode_classNum_unique").using("btree", table.semsCtx.asc().nullsLast().op("int4_ops"), table.subjectCode.asc().nullsLast().op("text_ops"), table.classNum.asc().nullsLast().op("text_ops")),
]);

export const curricula = pgTable("curricula", {
  year: integer().primaryKey().notNull(),
});

export const subject = pgTable("subject", {
  id: integer().primaryKey().notNull(),
  code: text().notNull(),
  name: text().notNull(),
  sks: integer().notNull(),
  category: subjectCategory(),
  curriculaYear: integer("curricula_year").notNull(),
}, (table) => [
  uniqueIndex("subject_code_curricula_unique").using("btree", table.code.asc().nullsLast().op("int4_ops"), table.curriculaYear.asc().nullsLast().op("int4_ops")),
  index("subject_code_idx").using("btree", table.code.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.curriculaYear],
    foreignColumns: [curricula.year],
    name: "subject_curricula_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const subjectClass = pgTable("subject_class", {
  id: integer().primaryKey().notNull(),
  number: integer().notNull(),
  edunexClassId: integer("edunex_class_id"),
  teamsLink: text("teams_link"),
  majorId: integer("major_id").notNull(),
  quota: integer(),
  semesterId: integer("semester_id").notNull(),
  subjectId: integer("subject_id").notNull(),
}, (table) => [
  foreignKey({
    columns: [table.majorId],
    foreignColumns: [major.id],
    name: "subjectClass_major_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.semesterId],
    foreignColumns: [semester.id],
    name: "subjectClass_semester_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.subjectId],
    foreignColumns: [subject.id],
    name: "subjectClass_subject_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const classConstraint = pgTable("class_constraint", {
  id: serial().primaryKey().notNull(),
  other: text().array(),
  faculties: text().array(),
  stratas: strata().array(),
  campuses: campus().array(),
  subjectClassId: integer("subject_class_id").notNull(),
  semester: integer().array(),
}, (table) => [
  uniqueIndex("classConstraint_subjectClassId_unique").using("btree", table.subjectClassId.asc().nullsLast().op("int4_ops")),
  foreignKey({
    columns: [table.subjectClassId],
    foreignColumns: [subjectClass.id],
    name: "classConstraint_subjectClass_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const classSchedule = pgTable("class_schedule", {
  id: serial().primaryKey().notNull(),
  start: timestamp({ precision: 6, withTimezone: true, mode: "string" }).notNull(),
  end: timestamp({ precision: 6, withTimezone: true, mode: "string" }).notNull(),
  activity: scheduleActivity().notNull(),
  method: scheduleMethod().notNull(),
  unixStart: bigint("unix_start", { mode: "number" }).notNull(),
  unixEnd: bigint("unix_end", { mode: "number" }).notNull(),
  subjectClassId: integer("subject_class_id").notNull(),
}, (table) => [
  index("classschedule_end_idx").using("btree", table.end.asc().nullsLast().op("timestamptz_ops")),
  index("classschedule_start_idx").using("btree", table.start.asc().nullsLast().op("timestamptz_ops")),
  index("classschedule_unix_end_idx").using("btree", table.unixEnd.asc().nullsLast().op("int8_ops")),
  index("classschedule_unix_start_idx").using("btree", table.unixStart.asc().nullsLast().op("int8_ops")),
  foreignKey({
    columns: [table.subjectClassId],
    foreignColumns: [subjectClass.id],
    name: "classSchedule_subjectClass_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const room = pgTable("room", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
}, (table) => [uniqueIndex("room_name_unique").using("btree", table.name.asc().nullsLast().op("text_ops"))]);

export const roomInClass = pgTable("room_in_class", {
  roomId: integer("room_id").notNull(),
  classScheduleId: integer("class_schedule_id").notNull(),
}, (table) => [
  foreignKey({
    columns: [table.roomId],
    foreignColumns: [room.id],
    name: "classSchedule_room_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.classScheduleId],
    foreignColumns: [classSchedule.id],
    name: "room_classSchedule_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  primaryKey({ columns: [table.classScheduleId, table.roomId], name: "room_in_class_pk" }),
]);

export const lecturerInClass = pgTable("lecturer_in_class", {
  lecturerId: integer("lecturer_id").notNull(),
  subjectClassId: integer("subject_class_id").notNull(),
}, (table) => [
  foreignKey({
    columns: [table.subjectClassId],
    foreignColumns: [subjectClass.id],
    name: "lecturer_subjectClass_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.lecturerId],
    foreignColumns: [lecturer.id],
    name: "subjectClass_lecturer_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  primaryKey({ columns: [table.lecturerId, table.subjectClassId], name: "lecturer_in_class_pk" }),
]);

export const classReminder = pgTable("class_reminder", {
  id: serial().primaryKey().notNull(),
  jid: text().notNull(),
  subjectClassId: integer("subject_class_id").notNull(),
  anchorAtEnd: boolean("anchor_at_end").default(false).notNull(),
  offsetMinutes: integer("offset_minutes").default(0).notNull(),
}, (table) => [
  uniqueIndex("classReminder_jid_subjectClassId_offset_unique").using("btree", table.jid.asc().nullsLast().op("int4_ops"), table.subjectClassId.asc().nullsLast().op("int4_ops"), table.offsetMinutes.asc().nullsLast().op("bool_ops"), table.anchorAtEnd.asc().nullsLast().op("text_ops")),
  index("classReminder_subjectClassId_idx").using("btree", table.subjectClassId.asc().nullsLast().op("int4_ops")),
  foreignKey({
    columns: [table.subjectClassId],
    foreignColumns: [subjectClass.id],
    name: "classReminder_subjectClass_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const classReminderView = pgTable("class_reminder_view", {
  scheduleId: integer("schedule_id"),
  classId: integer("class_id"),
  jid: text(),
  anchorAtEnd: boolean("anchor_at_end"),
  alertTimeUnix: bigint("alert_time_unix", { mode: "number" }),
});

export const classFollower = pgTable("class_follower", {
  id: serial().primaryKey().notNull(),
  jid: text().notNull(),
  subjectClassId: integer("subject_class_id").notNull(),
}, (table) => [
  uniqueIndex("classFollower_jid_subjectClassId_unique").using("btree", table.jid.asc().nullsLast().op("int4_ops"), table.subjectClassId.asc().nullsLast().op("int4_ops")),
  index("classFollower_subjectClassId_idx").using("btree", table.subjectClassId.asc().nullsLast().op("int4_ops")),
  foreignKey({
    columns: [table.subjectClassId],
    foreignColumns: [subjectClass.id],
    name: "classFollower_subjectClass_fk",
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const majorInConstraint = pgTable("major_in_constraint", {
  classConstraintId: integer("class_constraint_id").notNull(),
  constraintMajorId: integer("constraint_major_id").notNull(),
}, (table) => [
  foreignKey({
    columns: [table.constraintMajorId],
    foreignColumns: [constraintMajor.id],
    name: "classConstraint_constraintMajor_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.classConstraintId],
    foreignColumns: [classConstraint.id],
    name: "constraintMajor_classConstraint_fk",
  }).onUpdate("cascade").onDelete("cascade"),
  primaryKey({ columns: [table.classConstraintId, table.constraintMajorId], name: "major_in_constraint_pk" }),
]);
