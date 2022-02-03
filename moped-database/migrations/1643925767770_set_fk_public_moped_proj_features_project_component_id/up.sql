alter table "public"."moped_proj_features"
           add constraint "moped_proj_features_project_component_id_fkey"
           foreign key ("project_component_id")
           references "public"."moped_proj_components"
           ("project_component_id") on update cascade on delete cascade;
