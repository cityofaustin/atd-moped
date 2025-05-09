ALTER TABLE "public"."moped_activity_log" ADD COLUMN "record_project_id" INT DEFAULT 0;
COMMENT ON COLUMN "public"."moped_activity_log"."record_project_id" IS E'A project id number if this record is related to a project';
CREATE INDEX moped_activity_log_project_id_index ON moped_activity_log (record_project_id);
