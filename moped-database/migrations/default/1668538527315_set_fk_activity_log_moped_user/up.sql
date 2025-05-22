alter table "public"."moped_activity_log"
  add constraint "moped_activity_log_updated_by_user_id_fkey"
  foreign key ("updated_by_user_id")
  references "public"."moped_users"
  ("user_id") on update cascade on delete set null;
