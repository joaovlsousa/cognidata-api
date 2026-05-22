CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicator_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"duration_in_seconds" double precision NOT NULL,
	"count_question" integer NOT NULL,
	"score" integer NOT NULL,
	"percentage" integer NOT NULL,
	"theta_final" double precision NOT NULL,
	"theta_error" double precision NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_applicator_id_users_id_fk" FOREIGN KEY ("applicator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;