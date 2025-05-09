ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "first_name" text;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "first_name" DROP NOT NULL;
