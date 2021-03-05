alter table "public"."moped_project_files"
           add constraint "moped_project_files_created_by_fkey"
           foreign key ("created_by")
           references "public"."moped_users"
           ("user_id") on update no action on delete no action;
