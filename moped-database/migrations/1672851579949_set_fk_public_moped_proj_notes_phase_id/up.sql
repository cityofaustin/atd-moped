-- create foreign key relationship between moped_proj_notes and moped_phases on phase_id
alter table "public"."moped_proj_notes"
  add constraint "moped_proj_notes_phase_id_fkey"
  foreign key ("phase_id")
  references "public"."moped_phases"
  ("phase_id") on update cascade on delete set null;
