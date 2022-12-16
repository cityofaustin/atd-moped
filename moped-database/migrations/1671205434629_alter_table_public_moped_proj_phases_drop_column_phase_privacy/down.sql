alter table "public"."moped_proj_phases" alter column "phase_privacy" drop not null;
alter table "public"."moped_proj_phases" add column "phase_privacy" bool;
