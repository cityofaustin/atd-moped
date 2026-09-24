ALTER TABLE "public"."moped_components" ADD COLUMN "status_id" int4 NOT NULL DEFAULT 0;

-- Go back to status_id for soft deletes
UPDATE moped_components
SET status_id = 0
WHERE is_deleted = TRUE;

ALTER TABLE "public"."moped_components" DROP COLUMN "is_deleted";
