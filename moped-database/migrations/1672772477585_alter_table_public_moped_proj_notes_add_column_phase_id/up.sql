-- add nullable phase_id column of type integer to moped_proj_notes
alter table "public"."moped_proj_notes" add column "phase_id" integer
 null;
