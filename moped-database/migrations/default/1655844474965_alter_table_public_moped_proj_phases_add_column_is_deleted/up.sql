alter table "public"."moped_proj_phases" add column "is_deleted" boolean
 not null default 'false';

COMMENT ON COLUMN moped_proj_phases.is_deleted IS 'Indicates soft deletion';
COMMENT ON COLUMN moped_proj_phases.status_id IS 'Deprecated soft deletion column';

-- Update new is_deleted columns to preserve existing soft deletes that used status_id = 0
UPDATE moped_proj_phases
SET is_deleted = TRUE
WHERE status_id = 0;
