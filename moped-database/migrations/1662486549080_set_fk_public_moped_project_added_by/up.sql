alter table "public"."moped_project"
  add constraint "moped_project_added_by_fkey"
  foreign key ("added_by")
  references "public"."moped_users"
  ("user_id") on update cascade on delete set null;
