CREATE TABLE "public"."moped_note_types" ("id" serial NOT NULL, "name" text NOT NULL UNIQUE, "slug" text NOT NULL UNIQUE, PRIMARY KEY ("id"));

COMMENT ON TABLE "public"."moped_note_types" IS 'lookup table of note types';
INSERT INTO moped_note_types (name, slug) VALUES
('Internal Note', 'internal_note'),
('Status Update', 'status_update');


ALTER TABLE "public"."moped_proj_notes"
ADD CONSTRAINT moped_proj_notes_type_fkey FOREIGN KEY ("project_note_type")
REFERENCES moped_note_types ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."moped_proj_notes"
ALTER COLUMN "project_note_type" DROP DEFAULT;

ALTER TABLE "public"."moped_proj_notes"
ALTER COLUMN "project_note_type" SET NOT NULL;
