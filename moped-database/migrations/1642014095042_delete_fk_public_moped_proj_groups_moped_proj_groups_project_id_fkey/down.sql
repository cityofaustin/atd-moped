alter table "public"."moped_proj_groups" add foreign key ("project_id") references "public"."moped_project"("project_id") on update restrict on delete restrict;
