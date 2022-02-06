ALTER TABLE "public"."moped_proj_features" ADD COLUMN "project_id" int4;
ALTER TABLE "public"."moped_proj_features" ALTER COLUMN "project_id" DROP NOT NULL;
