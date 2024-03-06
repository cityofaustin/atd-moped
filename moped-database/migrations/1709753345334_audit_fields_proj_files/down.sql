ALTER TABLE moped_proj_files RENAME COLUMN created_at TO create_date;
ALTER TABLE moped_proj_files RENAME COLUMN created_by_user_id TO created_by;
ALTER TABLE moped_proj_files DROP COLUMN updated_at;
ALTER TABLE moped_proj_files DROP COLUMN updated_by_user_id;

DROP TRIGGER update_moped_proj_files_and_project_audit_fields ON moped_proj_files;
