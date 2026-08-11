ALTER TABLE "patients" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "cpf" varchar(64) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "cpf_applicator_id_idx" ON "patients" USING btree ("cpf","applicator_id");