DROP VIEW IF EXISTS combined_project_notes;

DELETE FROM moped_note_types
WHERE slug = 'ecapris_status';

ALTER TABLE moped_note_types DROP COLUMN source;
