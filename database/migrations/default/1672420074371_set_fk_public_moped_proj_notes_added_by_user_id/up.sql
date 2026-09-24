alter table "public"."moped_proj_notes"
  add constraint "moped_proj_notes_added_by_user_id_fkey"
  foreign key ("added_by_user_id")
  references "public"."moped_users"
  ("user_id") on update cascade on delete set null;
