alter table "public"."moped_proj_notes" add foreign key ("comm_id") references "public"."moped_proj_communication"("comm_id") on update restrict on delete restrict;
