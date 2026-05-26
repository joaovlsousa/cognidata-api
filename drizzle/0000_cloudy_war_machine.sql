CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"status" varchar DEFAULT 'peending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"valid_until" timestamp NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "otp_codes_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_number" integer NOT NULL,
	"item_index" integer NOT NULL,
	"response_time_in_seconds" integer NOT NULL,
	"skill" varchar(255) NOT NULL,
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
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicator_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"duration_in_seconds" double precision NOT NULL,
	"count_question" integer NOT NULL,
	"skill" varchar(255) NOT NULL,
	"score" integer NOT NULL,
	"percentage" integer NOT NULL,
	"theta_final" double precision NOT NULL,
	"theta_error" double precision NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicator_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"gender" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"institution" varchar(255) NOT NULL,
	"grade" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar DEFAULT 'applicator' NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"cpf" varchar(11) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"contact_phone" varchar(11) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "session_items" ADD CONSTRAINT "session_items_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_applicator_id_users_id_fk" FOREIGN KEY ("applicator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_applicator_id_users_id_fk" FOREIGN KEY ("applicator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;