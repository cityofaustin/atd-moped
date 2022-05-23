ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN moped_proj_funding.is_deleted IS 'Indicates soft deletion';

UPDATE moped_proj_funding
SET is_deleted = TRUE
WHERE funding_status_id = 0;