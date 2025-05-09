ALTER TABLE "public"."moped_entity" ADD COLUMN "abbreviated_name" text;
ALTER TABLE "public"."moped_entity" ALTER COLUMN "abbreviated_name" DROP NOT NULL;
