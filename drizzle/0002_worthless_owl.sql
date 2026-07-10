ALTER TABLE "students" RENAME TO "patients";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "student_id" TO "patient_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "patients" DROP CONSTRAINT "students_applicator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "patient_responsible_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "patient_responsible_kinship" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "patient_responsible_phone" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "patient_responsible_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "school_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "school_year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "school_schedule" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "medical_chief_complaint" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "medical_observations" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_applicator_id_users_id_fk" FOREIGN KEY ("applicator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN "institution";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN "grade";