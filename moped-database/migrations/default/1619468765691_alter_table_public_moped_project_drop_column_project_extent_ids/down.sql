ALTER TABLE "public"."moped_project" ADD COLUMN "project_extent_ids" jsonb;
ALTER TABLE "public"."moped_project" ALTER COLUMN "project_extent_ids" DROP NOT NULL;
