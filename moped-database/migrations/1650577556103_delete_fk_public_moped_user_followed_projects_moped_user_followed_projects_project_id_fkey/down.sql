alter table "public"."moped_user_followed_projects" add foreign key ("project_id") references "public"."moped_users"("user_id") on update restrict on delete restrict;
