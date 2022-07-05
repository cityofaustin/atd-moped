alter table "public"."moped_project" add column "parent_project_id" integer
 null;

alter table "public"."moped_project"
  add constraint "moped_project_parent_project_id_fkey"
  foreign key ("parent_project_id")
  references "public"."moped_project"
  ("project_id") on update cascade on delete set null;
