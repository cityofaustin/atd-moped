
ALTER TABLE "public"."moped_proj_features" ADD COLUMN "project_id" int4;
ALTER TABLE "public"."moped_proj_features" ALTER COLUMN "project_id" DROP NOT NULL;

alter table "public"."moped_proj_features" add foreign key ("project_id") references "public"."moped_project"("project_id") on update cascade on delete cascade;
