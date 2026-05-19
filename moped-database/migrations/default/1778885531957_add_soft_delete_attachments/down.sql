ALTER TABLE files_ecapris_funding DROP COLUMN is_deleted;
ALTER TABLE files_project_funding DROP COLUMN is_deleted;

DROP TRIGGER IF EXISTS set_files_updated_at ON files_ecapris_funding;
DROP TRIGGER IF EXISTS set_files_updated_at ON files_project_funding;
