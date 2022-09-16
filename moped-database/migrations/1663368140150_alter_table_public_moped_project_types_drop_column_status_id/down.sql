comment on column "public"."moped_project_types"."status_id" is E'List of related project types';
alter table "public"."moped_project_types" alter column "status_id" set default 0;
alter table "public"."moped_project_types" alter column "status_id" drop not null;
alter table "public"."moped_project_types" add column "status_id" int4;
