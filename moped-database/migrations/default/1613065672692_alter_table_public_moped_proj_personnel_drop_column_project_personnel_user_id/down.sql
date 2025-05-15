ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "project_personnel_user_id" int4;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "project_personnel_user_id" DROP NOT NULL;
