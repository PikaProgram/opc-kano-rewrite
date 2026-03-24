import { pgEnum } from "drizzle-orm/pg-core";

export const campus = pgEnum("campus", ["JATINANGOR", "GANESHA", "CIREBON", "JAKARTA"]);
export const participantRole = pgEnum("participant_role", ["member", "admin", "superadmin", "manager", "left"]);
export const scheduleActivity = pgEnum("schedule_activity", ["LECTURE", "TUTORIAL", "LAB_WORK", "QUIZ", "MIDTERM", "FINAL"]);
export const scheduleMethod = pgEnum("schedule_method", ["IN_PERSON", "ONLINE", "HYBRID"]);
export const strata = pgEnum("strata", ["S1", "S2", "S3", "PR"]);
export const subjectCategory = pgEnum("subject_category", ["LECTURE", "RESEARCH", "INTERNSHIP", "THESIS"]);
