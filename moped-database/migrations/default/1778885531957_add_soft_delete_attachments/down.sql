DROP TRIGGER IF EXISTS set_files_updated_at ON files_ecapris_funding;
DROP TRIGGER IF EXISTS set_files_updated_at ON files_project_funding;

ALTER TABLE public.files_project_funding
DROP CONSTRAINT IF EXISTS files_project_funding_entity_id_file_id_key;

ALTER TABLE files_ecapris_funding DROP COLUMN is_deleted;
ALTER TABLE files_project_funding DROP COLUMN is_deleted;
