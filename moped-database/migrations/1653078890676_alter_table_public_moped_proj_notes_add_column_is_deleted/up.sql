ALTER TABLE "public"."moped_proj_notes" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_proj_notes.is_deleted IS 'Indicates soft deletion';

UPDATE moped_proj_notes
SET is_deleted = TRUE
WHERE status_id = 0;
