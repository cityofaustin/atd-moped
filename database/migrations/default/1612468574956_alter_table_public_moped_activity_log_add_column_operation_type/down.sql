COMMENT ON COLUMN "public"."moped_activity_log"."operation_type" IS E'';
ALTER TABLE "public"."moped_activity_log" DROP COLUMN "operation_type";
DROP INDEX moped_activity_log_operation_type_index;
