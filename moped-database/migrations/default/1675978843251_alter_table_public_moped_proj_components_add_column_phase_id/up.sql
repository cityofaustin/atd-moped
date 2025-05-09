alter table "public"."moped_proj_components" add column "phase_id" integer
 null;
alter table "public"."moped_proj_components" add column "subphase_id" integer
 null;
alter table "public"."moped_proj_components" add column "phase_end" timestamptz
 null;
alter table "public"."moped_proj_components" add column "date_added" timestamptz
 not null default now();
alter table "public"."moped_proj_components"
  add constraint "moped_proj_components_phase_id_fkey"
  foreign key ("phase_id")
  references "public"."moped_phases"
  ("phase_id") on update cascade on delete set null;
alter table "public"."moped_proj_components"
  add constraint "moped_proj_components_subphase_id_fkey"
  foreign key ("subphase_id")
  references "public"."moped_subphases"
  ("subphase_id") on update cascade on delete set null;
