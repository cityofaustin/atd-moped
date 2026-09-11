-- First change the data type from varchar to uuid
ALTER TABLE moped_activity_log
    ALTER COLUMN updated_by TYPE uuid USING updated_by::uuid;

-- Lastly, update the comment on the column
COMMENT ON COLUMN "public"."moped_activity_log"."updated_by" IS E'The Cognito UUID';

-- Remove the updated_by_id column
DROP INDEX moped_activity_log_updated_by_id_index;
ALTER TABLE "public"."moped_activity_log" DROP COLUMN "updated_by_id" CASCADE;

