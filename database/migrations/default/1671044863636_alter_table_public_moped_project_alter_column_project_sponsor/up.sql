-- remove not null constraint and default value from moped_project project_sponsor column
ALTER TABLE "public"."moped_project" ALTER COLUMN "project_sponsor" drop default;
alter table "public"."moped_project" alter column "project_sponsor" drop not null;
