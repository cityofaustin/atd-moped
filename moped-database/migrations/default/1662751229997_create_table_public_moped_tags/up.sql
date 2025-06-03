CREATE TABLE "public"."moped_tags" (
	"id" serial, 
	"name" text NOT NULL, 
	"type" text NOT NULL, 
	"slug" text NOT NULL, 
	"is_deleted" boolean NOT NULL DEFAULT false, 
	PRIMARY KEY ("id") , 
	UNIQUE ("name"), UNIQUE ("slug"));
COMMENT ON TABLE "public"."moped_tags" IS E'Lookup table for all tags';
