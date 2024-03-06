ALTER TABLE moped_project_files RENAME COLUMN create_date TO created_at;
ALTER TABLE moped_project_files RENAME COLUMN created_by TO created_by_user_id;

ALTER TABLE moped_project_files ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE moped_project_files
ADD COLUMN updated_by_user_id INTEGER
CONSTRAINT updated_by_user_fkey REFERENCES moped_users (user_id);


COMMENT ON COLUMN moped_project_files.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_project_files.updated_by_user_id IS 'ID of the user who last updated the record';

CREATE TRIGGER update_moped_project_files_and_project_audit_fields
BEFORE INSERT
OR UPDATE ON moped_project_files
FOR EACH ROW
EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

COMMENT ON TRIGGER update_moped_project_files_and_project_audit_fields ON moped_project_files IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_phases table.';
