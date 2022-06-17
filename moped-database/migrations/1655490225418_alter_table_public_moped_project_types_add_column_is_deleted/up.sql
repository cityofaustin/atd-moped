ALTER TABLE "public"."moped_project_types" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_project_types.is_deleted IS 'Indicates soft deletion';
COMMENT ON COLUMN moped_project_types.status_id IS 'Deprecated soft deletion column';

-- Update new is_deleted columns to preserve existing soft deletes that used status_id = 0
UPDATE moped_project_types
SET is_deleted = TRUE
WHERE status_id = 0;
