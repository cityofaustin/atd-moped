comment on column "public"."moped_proj_personnel"."role_id" is E'Project Team members';
alter table "public"."moped_proj_personnel" add constraint "moped_proj_personnel_project_id_user_id_role_id_key" unique (project_id, role_id, user_id);
alter table "public"."moped_proj_personnel"
  add constraint "moped_proj_personnel_role_id_fkey"
  foreign key (role_id)
  references "public"."moped_project_roles"
  (project_role_id) on update restrict on delete restrict;
alter table "public"."moped_proj_personnel" alter column "role_id" drop not null;
alter table "public"."moped_proj_personnel" add column "role_id" int4;
