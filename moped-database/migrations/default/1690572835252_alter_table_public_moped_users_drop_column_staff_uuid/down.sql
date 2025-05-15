alter table "public"."moped_users" add column "staff_uuid" uuid;
alter table "public"."moped_users" alter column "staff_uuid" set default gen_random_uuid();
alter table "public"."moped_users" alter column "staff_uuid" drop not null;
comment on column "public"."moped_users"."staff_uuid" is E'Standardized list of city of Austin employees';
