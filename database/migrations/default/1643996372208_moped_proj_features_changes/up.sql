
ALTER TABLE "public"."moped_proj_features" ADD COLUMN "project_component_id" integer NULL;

alter table "public"."moped_proj_features"
           add constraint "moped_proj_features_project_component_id_fkey"
           foreign key ("project_component_id")
           references "public"."moped_proj_components"
           ("project_component_id") on update cascade on delete cascade;

-- this would ideal but will break in staging or prod
-- ALTER TABLE "public"."moped_proj_features" ALTER COLUMN "project_component_id" SET NOT NULL;

alter table "public"."moped_proj_features" rename column "location" to "feature";
