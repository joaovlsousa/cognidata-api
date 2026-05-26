ALTER TABLE "session_items" ADD COLUMN "response_time_in_seconds" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "session_items" ADD COLUMN "skill" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "skill" varchar(255) NOT NULL;