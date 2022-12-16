alter table "public"."moped_proj_phases" alter column "completed_by_user_id" drop not null;
alter table "public"."moped_proj_phases" add column "completed_by_user_id" int4;
