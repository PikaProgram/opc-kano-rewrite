ALTER TABLE "group_settings" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "sawit" ALTER COLUMN "participant_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "sawit_attack" ALTER COLUMN "participant_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "sawit_attack" ALTER COLUMN "group_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "sawit_attack" ALTER COLUMN "accepted_by" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "user_wordle" ALTER COLUMN "user_id" SET DATA TYPE bigint;