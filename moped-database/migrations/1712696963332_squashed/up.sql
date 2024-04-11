
alter table "public"."moped_proj_personnel" alter column "date_added" set default now();
comment on column "public"."moped_proj_personnel"."date_added" is E'Timestamp when the record was created';
alter table "public"."moped_proj_personnel" rename column "date_added" to "created_at";

comment on column "public"."moped_proj_personnel"."added_by" is E'ID of the user who created the record';
alter table "public"."moped_proj_personnel" rename column "added_by" to "created_by_user_id";

alter table "public"."moped_proj_personnel" add column "updated_at" Timestamp
 not null default now();

alter table "public"."moped_proj_personnel" add column "updated_by_user_id" integer
 null;

ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "updated_at" TYPE timestamptz;

comment on column "public"."moped_proj_personnel"."updated_at" is E'Timestamp when the record was last updated';

comment on column "public"."moped_proj_personnel"."updated_by_user_id" is E'ID of the user who last updated the record';

alter table "public"."moped_proj_personnel_roles" add column "created_at" timestamptz
 not null default now();

comment on column "public"."moped_proj_personnel_roles"."created_at" is E'Timestamp when the record was created';

alter table "public"."moped_proj_personnel_roles" add column "updated_at" timestamptz
 not null default now();

comment on column "public"."moped_proj_personnel_roles"."updated_at" is E'Timestamp when the record was last updated';

alter table "public"."moped_proj_personnel_roles" add column "created_by_user_id" integer
 null;

comment on column "public"."moped_proj_personnel_roles"."created_by_user_id" is E'ID of the user who created the record';

alter table "public"."moped_proj_personnel_roles" add column "updated_by_user_id" integer
 null;

comment on column "public"."moped_proj_personnel_roles"."updated_by_user_id" is E'ID of the user who last updated the record';
