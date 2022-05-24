ALTER TABLE "public"."moped_proj_features" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_proj_features.is_deleted IS 'Indicates soft deletion';

UPDATE moped_proj_features
SET is_deleted = TRUE
WHERE status_id = 0;