ALTER TABLE "users" ADD COLUMN "crp" varchar(7);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "cpf";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "institution";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "contact_phone";