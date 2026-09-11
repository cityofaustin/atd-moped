
alter table "public"."moped_proj_features" rename column "feature" to "location";

ALTER TABLE "public"."moped_proj_features" ALTER COLUMN "project_component_id" DROP NOT NULL;

alter table "public"."moped_proj_features" drop constraint "moped_proj_features_project_component_id_fkey";

ALTER TABLE "public"."moped_proj_features" DROP COLUMN "project_component_id";
