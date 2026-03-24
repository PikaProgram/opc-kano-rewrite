CREATE TYPE "public"."campus" AS ENUM('JATINANGOR', 'GANESHA', 'CIREBON', 'JAKARTA');--> statement-breakpoint
CREATE TYPE "public"."participant_role" AS ENUM('member', 'admin', 'superadmin', 'manager', 'left');--> statement-breakpoint
CREATE TYPE "public"."schedule_activity" AS ENUM('LECTURE', 'TUTORIAL', 'LAB_WORK', 'QUIZ', 'MIDTERM', 'FINAL');--> statement-breakpoint
CREATE TYPE "public"."schedule_method" AS ENUM('IN_PERSON', 'ONLINE', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."strata" AS ENUM('S1', 'S2', 'S3', 'PR');--> statement-breakpoint
CREATE TYPE "public"."subject_category" AS ENUM('LECTURE', 'RESEARCH', 'INTERNSHIP', 'THESIS');--> statement-breakpoint
CREATE TABLE "community" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"jid" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"name" text NOT NULL,
	CONSTRAINT "community_jid_unique" UNIQUE("jid")
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"jid" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"push_name" text,
	"custom_name" text,
	"confess_target" integer,
	CONSTRAINT "contact_jid_unique" UNIQUE("jid")
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"jid" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"name" text NOT NULL,
	"community_id" bigint,
	"is_announcement" boolean DEFAULT false NOT NULL,
	CONSTRAINT "group_jid_unique" UNIQUE("jid")
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"group_id" bigint NOT NULL,
	"contact_id" bigint NOT NULL,
	"role" "participant_role" NOT NULL,
	CONSTRAINT "participant_contact_group_unique" UNIQUE("contact_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "vo_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"chat_jid" text NOT NULL,
	"message_id" text NOT NULL,
	"requester_jid" text NOT NULL,
	"message_owner_jid" text NOT NULL,
	"approval_message_id" text NOT NULL,
	"accepted" boolean,
	"url" text,
	"direct_path" text,
	"media_key" text NOT NULL,
	"file_sha256" text NOT NULL,
	"file_enc_sha256" text NOT NULL,
	"media_type" text NOT NULL,
	CONSTRAINT "vo_message_unique" UNIQUE("chat_jid","message_id")
);
--> statement-breakpoint
CREATE TABLE "class_constraint" (
	"id" serial PRIMARY KEY NOT NULL,
	"other" text[],
	"faculties" text[],
	"stratas" "strata"[],
	"campuses" "campus"[],
	"subject_class_id" integer NOT NULL,
	"semester" integer[]
);
--> statement-breakpoint
CREATE TABLE "class_follower" (
	"id" serial PRIMARY KEY NOT NULL,
	"jid" text NOT NULL,
	"subject_class_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_reminder" (
	"id" serial PRIMARY KEY NOT NULL,
	"jid" text NOT NULL,
	"subject_class_id" integer NOT NULL,
	"anchor_at_end" boolean DEFAULT false NOT NULL,
	"offset_minutes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_reminder_view" (
	"schedule_id" integer,
	"class_id" integer,
	"jid" text,
	"anchor_at_end" boolean,
	"alert_time_unix" bigint
);
--> statement-breakpoint
CREATE TABLE "class_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"start" timestamp(6) with time zone NOT NULL,
	"end" timestamp(6) with time zone NOT NULL,
	"activity" "schedule_activity" NOT NULL,
	"method" "schedule_method" NOT NULL,
	"unix_start" bigint NOT NULL,
	"unix_end" bigint NOT NULL,
	"subject_class_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "constraint_major" (
	"id" serial PRIMARY KEY NOT NULL,
	"addon_data" text NOT NULL,
	"major_id" integer
);
--> statement-breakpoint
CREATE TABLE "curricula" (
	"year" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "edunex_class_id" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) NOT NULL,
	"sems_ctx" text NOT NULL,
	"subject_code" text NOT NULL,
	"class_num" integer NOT NULL,
	"class_id" integer
);
--> statement-breakpoint
CREATE TABLE "lecturer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lecturer_in_class" (
	"lecturer_id" integer NOT NULL,
	"subject_class_id" integer NOT NULL,
	CONSTRAINT "lecturer_in_class_pk" PRIMARY KEY("lecturer_id","subject_class_id")
);
--> statement-breakpoint
CREATE TABLE "major" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"faculty" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major_in_constraint" (
	"class_constraint_id" integer NOT NULL,
	"constraint_major_id" integer NOT NULL,
	CONSTRAINT "major_in_constraint_pk" PRIMARY KEY("class_constraint_id","constraint_major_id")
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_in_class" (
	"room_id" integer NOT NULL,
	"class_schedule_id" integer NOT NULL,
	CONSTRAINT "room_in_class_pk" PRIMARY KEY("class_schedule_id","room_id")
);
--> statement-breakpoint
CREATE TABLE "semester" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"semester" integer NOT NULL,
	"end" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"start" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"nim" integer NOT NULL,
	"major" text NOT NULL,
	"faculty" text NOT NULL,
	"custom_name" text,
	CONSTRAINT "student_nim" UNIQUE("nim"),
	CONSTRAINT "students_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" integer PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"sks" integer NOT NULL,
	"category" "subject_category",
	"curricula_year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject_class" (
	"id" integer PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"edunex_class_id" integer,
	"teams_link" text,
	"major_id" integer NOT NULL,
	"quota" integer,
	"semester_id" integer NOT NULL,
	"subject_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_game_allowed" boolean DEFAULT false NOT NULL,
	"is_confess_allowed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sawit" (
	"participant_id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_grow_date" text NOT NULL,
	"height" integer DEFAULT 0 NOT NULL,
	"attack_total" integer DEFAULT 0 NOT NULL,
	"attack_win" integer DEFAULT 0 NOT NULL,
	"attack_acquired_height" integer DEFAULT 0 NOT NULL,
	"attack_lost_height" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sawit_attack" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"participant_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"message_id" text NOT NULL,
	"attack_size" integer NOT NULL,
	"accepted_by" integer,
	"is_attacker_win" boolean,
	CONSTRAINT "sawitattack_unique" UNIQUE("group_id","message_id")
);
--> statement-breakpoint
CREATE TABLE "user_wordle" (
	"id" serial PRIMARY KEY NOT NULL,
	"target_id" integer NOT NULL,
	"guesses" text[] NOT NULL,
	"date_str" text NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "user_wordle_unique" UNIQUE("date_str","user_id")
);
--> statement-breakpoint
CREATE TABLE "wordle" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"point" integer NOT NULL,
	"lang" varchar(5) NOT NULL,
	"is_wordle" boolean DEFAULT false NOT NULL,
	CONSTRAINT "wordle_word_unique" UNIQUE("lang","word")
);
--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_confess_group_fk" FOREIGN KEY ("confess_target") REFERENCES "public"."group"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_community_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_group_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_contact_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "class_constraint" ADD CONSTRAINT "classConstraint_subjectClass_fk" FOREIGN KEY ("subject_class_id") REFERENCES "public"."subject_class"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "class_follower" ADD CONSTRAINT "classFollower_subjectClass_fk" FOREIGN KEY ("subject_class_id") REFERENCES "public"."subject_class"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "class_reminder" ADD CONSTRAINT "classReminder_subjectClass_fk" FOREIGN KEY ("subject_class_id") REFERENCES "public"."subject_class"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "class_schedule" ADD CONSTRAINT "classSchedule_subjectClass_fk" FOREIGN KEY ("subject_class_id") REFERENCES "public"."subject_class"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "constraint_major" ADD CONSTRAINT "constraintMajor_classConstraint_fk" FOREIGN KEY ("major_id") REFERENCES "public"."major"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "lecturer_in_class" ADD CONSTRAINT "lecturer_subjectClass_fk" FOREIGN KEY ("subject_class_id") REFERENCES "public"."subject_class"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "lecturer_in_class" ADD CONSTRAINT "subjectClass_lecturer_fk" FOREIGN KEY ("lecturer_id") REFERENCES "public"."lecturer"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "major_in_constraint" ADD CONSTRAINT "classConstraint_constraintMajor_fk" FOREIGN KEY ("constraint_major_id") REFERENCES "public"."constraint_major"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "major_in_constraint" ADD CONSTRAINT "constraintMajor_classConstraint_fk" FOREIGN KEY ("class_constraint_id") REFERENCES "public"."class_constraint"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "room_in_class" ADD CONSTRAINT "classSchedule_room_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "room_in_class" ADD CONSTRAINT "room_classSchedule_fk" FOREIGN KEY ("class_schedule_id") REFERENCES "public"."class_schedule"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_curricula_fk" FOREIGN KEY ("curricula_year") REFERENCES "public"."curricula"("year") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subject_class" ADD CONSTRAINT "subjectClass_major_fk" FOREIGN KEY ("major_id") REFERENCES "public"."major"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subject_class" ADD CONSTRAINT "subjectClass_semester_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."semester"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subject_class" ADD CONSTRAINT "subjectClass_subject_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "group_settings" ADD CONSTRAINT "group_settings_fk" FOREIGN KEY ("id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sawit" ADD CONSTRAINT "sawit_participant_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sawit_attack" ADD CONSTRAINT "sawitattack_group_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sawit_attack" ADD CONSTRAINT "sawitattack_participant_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sawit_attack" ADD CONSTRAINT "sawitattack_accepted_participant_fk" FOREIGN KEY ("accepted_by") REFERENCES "public"."participant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wordle" ADD CONSTRAINT "user_wordle_contact_fk" FOREIGN KEY ("user_id") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wordle" ADD CONSTRAINT "user_wordle_wordle_fk" FOREIGN KEY ("target_id") REFERENCES "public"."wordle"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "classConstraint_subjectClassId_unique" ON "class_constraint" USING btree ("subject_class_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "classFollower_jid_subjectClassId_unique" ON "class_follower" USING btree ("jid" int4_ops,"subject_class_id" int4_ops);--> statement-breakpoint
CREATE INDEX "classFollower_subjectClassId_idx" ON "class_follower" USING btree ("subject_class_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "classReminder_jid_subjectClassId_offset_unique" ON "class_reminder" USING btree ("jid" int4_ops,"subject_class_id" int4_ops,"offset_minutes" bool_ops,"anchor_at_end" text_ops);--> statement-breakpoint
CREATE INDEX "classReminder_subjectClassId_idx" ON "class_reminder" USING btree ("subject_class_id" int4_ops);--> statement-breakpoint
CREATE INDEX "classschedule_end_idx" ON "class_schedule" USING btree ("end" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "classschedule_start_idx" ON "class_schedule" USING btree ("start" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "classschedule_unix_end_idx" ON "class_schedule" USING btree ("unix_end" int8_ops);--> statement-breakpoint
CREATE INDEX "classschedule_unix_start_idx" ON "class_schedule" USING btree ("unix_start" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "constraintMajor_addonData_majorId_unique" ON "constraint_major" USING btree ("addon_data" int4_ops,"major_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "edunexclassid_semsCtx_subjectCode_classNum_unique" ON "edunex_class_id" USING btree ("sems_ctx" int4_ops,"subject_code" text_ops,"class_num" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "lecturer_name_unique" ON "lecturer" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "room_name_unique" ON "room" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "semester_year_semester_unique" ON "semester" USING btree ("year" int4_ops,"semester" int4_ops);--> statement-breakpoint
CREATE INDEX "student_custom_name_idx" ON "students" USING gist ("custom_name" gist_trgm_ops);--> statement-breakpoint
CREATE INDEX "student_name_idx" ON "students" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "subject_code_curricula_unique" ON "subject" USING btree ("code" int4_ops,"curricula_year" int4_ops);--> statement-breakpoint
CREATE INDEX "subject_code_idx" ON "subject" USING btree ("code" text_ops);