alter table "public"."moped_proj_tags" drop constraint "moped_proj_tags_tag_id_fkey",
  add constraint "moped_proj_tags_tag_id_fkey"
  foreign key ("tag_id")
  references "public"."moped_tags"
  ("id") on update cascade on delete set null;
