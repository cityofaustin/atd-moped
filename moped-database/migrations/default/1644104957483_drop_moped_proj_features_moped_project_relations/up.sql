
alter table "public"."moped_proj_features" drop constraint "moped_proj_features_project_id_fkey";

ALTER TABLE "public"."moped_proj_features" DROP COLUMN "project_id" CASCADE;
