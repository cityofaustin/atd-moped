ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "workgroup" text;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "workgroup" DROP NOT NULL;
