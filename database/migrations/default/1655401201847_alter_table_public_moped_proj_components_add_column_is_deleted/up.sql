ALTER TABLE "public"."moped_proj_components" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_proj_components.is_deleted IS 'Indicates soft deletion';
COMMENT ON COLUMN moped_proj_components.status_id IS 'Deprecated soft deletion column';

-- Update new is_deleted columns to preserve existing soft deletes that used status_id = 0
UPDATE moped_proj_components
SET is_deleted = TRUE
WHERE status_id = 0;
