comment on column "public"."moped_proj_features"."status_id" is E'Project extent features';
alter table "public"."moped_proj_features" alter column "status_id" set default 0;
alter table "public"."moped_proj_features" alter column "status_id" drop not null;
alter table "public"."moped_proj_features" add column "status_id" int4;
