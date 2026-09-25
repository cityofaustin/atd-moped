alter table "public"."moped_proj_personnel" add constraint "moped_proj_personnel_project_id_user_id_role_id_key" unique ("project_id", "user_id", "role_id");
