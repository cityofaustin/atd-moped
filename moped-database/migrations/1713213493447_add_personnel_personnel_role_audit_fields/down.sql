
comment on column "public"."moped_proj_personnel_roles"."updated_by_user_id" is NULL;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_proj_personnel_roles" add column "updated_by_user_id" integer
--  null;

comment on column "public"."moped_proj_personnel_roles"."created_by_user_id" is NULL;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_proj_personnel_roles" add column "created_by_user_id" integer
--  null;

comment on column "public"."moped_proj_personnel_roles"."updated_at" is NULL;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_proj_personnel_roles" add column "updated_at" timestamptz
--  not null default now();

comment on column "public"."moped_proj_personnel_roles"."created_at" is NULL;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_proj_personnel_roles" add column "created_at" timestamptz
--  not null default now();

comment on column "public"."moped_proj_personnel"."updated_by_user_id" is NULL;

comment on column "public"."moped_proj_personnel"."updated_at" is NULL;

ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "updated_at" TYPE timestamp without time zone;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_proj_personnel" add column "updated_by_user_id" integer
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."moped_proj_personnel" add column "updated_at" Timestamp
--  not null default now();

alter table "public"."moped_proj_personnel" rename column "created_by_user_id" to "added_by";
comment on column "public"."moped_proj_personnel"."added_by" is NULL;

alter table "public"."moped_proj_personnel" rename column "created_at" to "date_added";
comment on column "public"."moped_proj_personnel"."date_added" is NULL;
alter table "public"."moped_proj_personnel" alter column "date_added" set default clock_timestamp();
