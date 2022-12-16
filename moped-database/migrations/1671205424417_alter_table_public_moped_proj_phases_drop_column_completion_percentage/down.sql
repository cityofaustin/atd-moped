alter table "public"."moped_proj_phases" alter column "completion_percentage" drop not null;
alter table "public"."moped_proj_phases" add column "completion_percentage" int4;
