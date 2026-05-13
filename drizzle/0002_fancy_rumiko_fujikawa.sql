CREATE TABLE "codes" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"valid_until" timestamp NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
