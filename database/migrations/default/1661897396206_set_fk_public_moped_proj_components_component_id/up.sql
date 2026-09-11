alter table "public"."moped_proj_components" drop constraint "moped_proj_components_component_id_fkey",
  add constraint "moped_proj_components_component_id_fkey"
  foreign key ("component_id")
  references "public"."moped_components"
  ("component_id") on update cascade on delete set null;
