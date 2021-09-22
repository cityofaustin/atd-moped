ALTER TABLE "public"."moped_proj_notes" ADD COLUMN "project_note_type" integer NULL DEFAULT 0;
UPDATE "public"."moped_proj_notes" SET project_note_type = 0 WHERE project_note_id > 0;
