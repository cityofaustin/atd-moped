comment on column "public"."moped_users"."status_id" is E'Standardized list of city of Austin employees';
alter table "public"."moped_users" alter column "status_id" set default 0;
alter table "public"."moped_users" alter column "status_id" drop not null;
alter table "public"."moped_users" add column "status_id" int4;
