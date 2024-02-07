alter table "public"."moped_proj_milestones" rename column "date_added" to "created_at";
alter table "public"."moped_proj_milestones" add column "created_by_user_id" integer
 null;
alter table "public"."moped_proj_milestones" add column "updated_at" timestamptz
 null;
alter table "public"."moped_proj_milestones" add column "updated_by_user_id" integer
 null;
