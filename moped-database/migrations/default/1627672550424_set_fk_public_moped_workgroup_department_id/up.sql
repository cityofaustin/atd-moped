alter table "public"."moped_workgroup"
           add constraint "moped_workgroup_department_id_fkey"
           foreign key ("department_id")
           references "public"."moped_department"
           ("department_id") on update no action on delete no action;
