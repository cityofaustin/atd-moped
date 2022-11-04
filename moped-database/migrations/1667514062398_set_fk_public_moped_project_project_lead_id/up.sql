alter table "public"."moped_project"
  add constraint "moped_project_project_lead_id_fkey"
  foreign key ("project_lead_id")
  references "public"."moped_entity"
  ("entity_id") on update cascade on delete set null;
