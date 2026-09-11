alter table "public"."moped_project"
   add constraint "moped_project_project_sponsor_fkey"
       foreign key ("project_sponsor")
           references "public"."moped_entity"
               ("entity_id") on update cascade on delete cascade;
