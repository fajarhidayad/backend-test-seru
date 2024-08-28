CREATE TABLE IF NOT EXISTS "pricelist" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"price" numeric NOT NULL,
	"year_id" integer NOT NULL,
	"model_id" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "pricelist_model_id_year_id_unique" UNIQUE("model_id","year_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_brand" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "vehicle_brand_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_model" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type_id" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand_id" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_year" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" smallint NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "vehicle_year_year_unique" UNIQUE("year")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pricelist" ADD CONSTRAINT "pricelist_year_id_vehicle_type_id_fk" FOREIGN KEY ("year_id") REFERENCES "public"."vehicle_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pricelist" ADD CONSTRAINT "pricelist_model_id_vehicle_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vehicle_model"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_model" ADD CONSTRAINT "vehicle_model_type_id_vehicle_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."vehicle_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_type" ADD CONSTRAINT "vehicle_type_brand_id_vehicle_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."vehicle_brand"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
