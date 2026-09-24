alter table "public"."moped_project"
           add constraint "moped_project_status_id_fkey"
           foreign key ("status_id")
           references "public"."moped_status"
           ("status_id") on update cascade on delete cascade;
