ALTER TABLE "public"."moped_proj_notes" ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;

UPDATE moped_proj_notes
SET is_deleted = TRUE
WHERE status_id = 0;
