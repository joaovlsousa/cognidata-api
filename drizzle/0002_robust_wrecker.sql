CREATE TABLE "session_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_number" integer NOT NULL,
	"item_index" integer NOT NULL,
	"stimulus_name" varchar(255) NOT NULL,
	"correct_answer" varchar(255) NOT NULL,
	"player_answer" varchar(255) NOT NULL,
	"is_correct" boolean NOT NULL,
	"difficulty" double precision NOT NULL,
	"discrimination" double precision NOT NULL,
	"guessing" double precision NOT NULL,
	"probability" double precision NOT NULL,
	"information" double precision NOT NULL,
	"theta_before" double precision NOT NULL,
	"theta_after" double precision NOT NULL,
	"theta_error" double precision NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "session_items" ADD CONSTRAINT "session_items_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;