ALTER TABLE "public"."moped_components" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_components.is_deleted IS 'Indicates soft deletion';

UPDATE moped_components
SET is_deleted = TRUE
WHERE status_id = 0;