alter table "public"."moped_proj_personnel" add column "status_id" int4;
alter table "public"."moped_proj_personnel" alter column "status_id" drop not null;
alter table "public"."moped_proj_personnel" alter column "status_id" set default 0;
comment on column "public"."moped_proj_personnel"."status_id" is E'Project Team members';
