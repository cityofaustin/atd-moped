alter table "public"."moped_proj_personnel"
           add constraint "moped_proj_personnel_role_id_fkey"
           foreign key ("role_id")
           references "public"."moped_project_roles"
           ("project_role_id") on update restrict on delete restrict;
