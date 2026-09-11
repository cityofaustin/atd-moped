alter table "public"."moped_proj_personnel"
           add constraint "moped_proj_personnel_user_id_fkey"
           foreign key ("user_id")
           references "public"."moped_users"
           ("user_id") on update restrict on delete restrict;
