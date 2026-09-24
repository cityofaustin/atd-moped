alter table "public"."moped_components_subcomponents" drop constraint "moped_components_subcomponents_component_id_fkey",
  add constraint "moped_components_subcomponents_component_id_fkey"
  foreign key ("component_id")
  references "public"."moped_components"
  ("component_id") on update restrict on delete restrict;
