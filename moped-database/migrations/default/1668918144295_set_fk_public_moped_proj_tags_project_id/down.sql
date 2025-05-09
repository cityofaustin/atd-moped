alter table "public"."moped_proj_tags" drop constraint "moped_proj_tags_project_id_fkey",
  add constraint "moped_proj_tags_project_id_fkey"
  foreign key ("project_id")
  references "public"."moped_project"
  ("project_id") on update cascade on delete set null;
