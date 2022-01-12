alter table "public"."moped_proj_groups" add foreign key ("group_id") references "public"."moped_group"("group_id") on update restrict on delete restrict;
