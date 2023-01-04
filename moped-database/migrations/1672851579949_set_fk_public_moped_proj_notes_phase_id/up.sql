alter table "public"."moped_proj_notes"
  add constraint "moped_proj_notes_phase_id_fkey"
  foreign key ("phase_id")
  references "public"."moped_phases"
  ("phase_id") on update cascade on delete cascade;
