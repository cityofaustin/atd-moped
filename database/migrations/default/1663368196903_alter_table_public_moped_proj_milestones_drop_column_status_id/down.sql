alter table "public"."moped_proj_milestones" add column "status_id" int4;
alter table "public"."moped_proj_milestones" alter column "status_id" drop not null;
alter table "public"."moped_proj_milestones" alter column "status_id" set default 0;
