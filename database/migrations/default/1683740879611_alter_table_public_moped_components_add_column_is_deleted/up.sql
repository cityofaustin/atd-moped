ALTER TABLE "public"."moped_components" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_components.is_deleted IS 'Indicates soft deletion';

-- Update new is_deleted columns to preserve existing soft deletes that used status_id = 0
UPDATE moped_components
SET is_deleted = TRUE
WHERE status_id = 0;

-- Remove the old status_id column
ALTER TABLE "public"."moped_components" DROP COLUMN "status_id" cascade;
