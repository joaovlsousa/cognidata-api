CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicator_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"gender" varchar NOT NULL,
	"bith_date" timestamp NOT NULL,
	"institution" varchar(255) NOT NULL,
	"grade" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_applicator_id_users_id_fk" FOREIGN KEY ("applicator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;