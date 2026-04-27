CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"cpf" varchar(11),
	"institution" varchar(255),
	"contact_phone" varchar(11),
	"academic_background" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
