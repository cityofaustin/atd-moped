ALTER TABLE "public"."moped_proj_milestones" RENAME COLUMN "created_at" TO "date_added";
ALTER TABLE "public"."moped_proj_milestones" DROP COLUMN "created_by_user_id";
ALTER TABLE "public"."moped_proj_milestones" DROP COLUMN "updated_at";
ALTER TABLE "public"."moped_proj_milestones" DROP COLUMN "updated_by_user_id";

DROP TRIGGER update_moped_proj_milestones_and_project_audit_fields ON moped_proj_milestones;
