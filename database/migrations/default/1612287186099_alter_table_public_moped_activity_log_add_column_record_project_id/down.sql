COMMENT ON COLUMN "public"."moped_activity_log"."record_project_id" IS E'';
ALTER TABLE "public"."moped_activity_log" DROP COLUMN "record_project_id";
DROP INDEX moped_activity_log_project_id_index;
