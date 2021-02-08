ALTER TABLE "public"."moped_activity_log" ADD COLUMN "operation_type" varchar(8) NULL;
COMMENT ON COLUMN "public"."moped_activity_log"."operation_type" IS E'The operation type as provided by Hasura: INSERT, UPDATE, DELETE';
CREATE INDEX moped_activity_log_operation_type_index ON moped_activity_log (operation_type);
