alter table "public"."moped_user_followed_projects" add foreign key ("user_id") references "public"."moped_project"("project_id") on update restrict on delete restrict;
