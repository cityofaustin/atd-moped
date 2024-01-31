ALTER TABLE moped_proj_phases RENAME COLUMN created_at TO date_added;
ALTER TABLE moped_proj_phases DROP COLUMN created_by_user_id;
ALTER TABLE moped_proj_phases DROP COLUMN updated_at;
ALTER TABLE moped_proj_phases DROP COLUMN updated_by_user_id;
DROP TRIGGER update_moped_proj_phases_and_project_audit_fields ON moped_proj_phases;
