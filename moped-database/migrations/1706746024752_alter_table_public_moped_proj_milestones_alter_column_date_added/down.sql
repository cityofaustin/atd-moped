alter table "public"."moped_proj_milestones" rename column "created_at" to "date_added";
alter table "public"."moped_proj_milestones" drop column "created_by_user_id";
alter table "public"."moped_proj_milestones" drop column "updated_at";
alter table "public"."moped_proj_milestones" drop column "updated_by_user_id";
