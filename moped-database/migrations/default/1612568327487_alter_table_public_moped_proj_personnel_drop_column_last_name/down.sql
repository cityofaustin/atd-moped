ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "last_name" text;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "last_name" DROP NOT NULL;
