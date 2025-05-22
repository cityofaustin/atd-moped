-- drop phase_id from moped_proj_notes
alter table "public"."moped_proj_notes" drop column "phase_id" cascade;
