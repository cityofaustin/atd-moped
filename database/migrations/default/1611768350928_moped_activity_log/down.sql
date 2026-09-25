-- Thirdly, change the data type from uuid to varchar
ALTER TABLE moped_activity_log
    ALTER COLUMN updated_by TYPE varchar(128) USING updated_by::varchar;

-- Restore the comment on the column
COMMENT ON COLUMN "public"."moped_activity_log"."updated_by" IS E'The Cognito UUID or AzureID as text';

-- Restore the updated_by_id column (rules, indexing, comments)
ALTER TABLE "public"."moped_activity_log" ADD COLUMN "updated_by_id" int4;
ALTER TABLE "public"."moped_activity_log" ALTER COLUMN "updated_by_id" DROP NOT NULL;
COMMENT ON COLUMN "public"."moped_activity_log"."updated_by_id" IS E'References the moped_users.user_id column';
CREATE INDEX moped_activity_log_updated_by_id_index ON moped_activity_log (updated_by_id);
