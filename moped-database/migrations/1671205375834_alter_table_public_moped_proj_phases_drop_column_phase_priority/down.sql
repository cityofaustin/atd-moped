alter table "public"."moped_proj_phases" alter column "phase_priority" drop not null;
alter table "public"."moped_proj_phases" add column "phase_priority" int4;
