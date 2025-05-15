alter table "public"."moped_proj_partners" add column "status_id" int4;
alter table "public"."moped_proj_partners" alter column "status_id" drop not null;
alter table "public"."moped_proj_partners" alter column "status_id" set default 0;
comment on column "public"."moped_proj_partners"."status_id" is E'moped_project_partners';
