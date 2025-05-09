-- add not null constraint and default 0 value to moped_project project_sponsor column
alter table "public"."moped_project" alter column "project_sponsor" set not null;
alter table "public"."moped_project" alter column "project_sponsor" set default '0';
