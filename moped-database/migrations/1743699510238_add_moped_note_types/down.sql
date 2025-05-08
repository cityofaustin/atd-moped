ALTER TABLE "public"."moped_proj_notes"
ALTER COLUMN "project_note_type" SET DEFAULT 1;

ALTER TABLE "public"."moped_proj_notes"
ALTER COLUMN "project_note_type" DROP NOT NULL;

ALTER TABLE "public"."moped_proj_notes"
DROP CONSTRAINT moped_proj_notes_type_fkey;

DROP TABLE "public"."moped_note_types"
