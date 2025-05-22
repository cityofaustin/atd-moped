alter table "public"."moped_proj_phases" add column "phase_privacy" bool;
alter table "public"."moped_proj_phases" add column "completion_percentage" int4;
alter table "public"."moped_proj_phases" add column "started_by_user_id" int4;
alter table "public"."moped_proj_phases" add column "completed_by_user_id" int4;
alter table "public"."moped_proj_phases" add column "phase_priority" int4;
alter table "public"."moped_proj_phases" add column "phase_status" text;
alter table "public"."moped_proj_phases" add column "phase_order" int4;
alter table "public"."moped_proj_phases" add column "completed" bool;
