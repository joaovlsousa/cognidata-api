DROP INDEX "cpf_applicator_id_idx";--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "cpf" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "cpf_hash" varchar(64) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "cpf_hash_applicator_id_idx" ON "patients" USING btree ("cpf_hash","applicator_id");