alter table "public"."moped_project" add column "public_process_status_id" integer;
alter table "public"."moped_project"
  add constraint "moped_project_public_process_status_id_fkey"
  foreign key ("public_process_status_id")
  references "public"."moped_public_process_statuses"
  ("id") on update set null on delete set null;
