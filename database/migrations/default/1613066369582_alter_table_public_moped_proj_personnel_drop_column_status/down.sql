ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "status" text;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "status" DROP NOT NULL;
