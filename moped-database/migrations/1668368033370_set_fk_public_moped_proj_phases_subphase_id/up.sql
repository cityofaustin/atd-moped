alter table "public"."moped_proj_phases"
  add constraint "moped_proj_phases_subphase_id_fkey"
  foreign key ("subphase_id")
  references "public"."moped_subphases"
  ("subphase_id") on update cascade on delete set null;
