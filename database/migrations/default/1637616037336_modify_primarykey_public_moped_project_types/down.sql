alter table "public"."moped_project_types" drop constraint "moped_project_types_pkey";
alter table "public"."moped_project_types"
    add constraint "moped_project_types_pkey" 
    primary key ( "project_type_id" );
