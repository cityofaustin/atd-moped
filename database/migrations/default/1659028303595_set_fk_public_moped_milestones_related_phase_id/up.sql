alter table "public"."moped_milestones"
  add constraint "moped_milestones_related_phase_id_fkey"
  foreign key ("related_phase_id")
  references "public"."moped_phases"
  ("phase_id") on update cascade on delete set null;
