alter table "public"."moped_user_followed_projects" drop constraint "moped_user_followed_projects_project_id_fkey",
  add constraint "moped_user_followed_projects_project_id_fkey"
  foreign key ("project_id")
  references "public"."moped_project"
  ("project_id") on update restrict on delete restrict;
