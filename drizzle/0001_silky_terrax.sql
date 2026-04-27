ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'applicator';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();