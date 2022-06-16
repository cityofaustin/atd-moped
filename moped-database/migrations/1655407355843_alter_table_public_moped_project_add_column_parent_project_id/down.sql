-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_project" add column "parent_project_id" integer
--  null;


alter table "public"."moped_project" drop constraint "moped_project_parent_project_id_fkey";
