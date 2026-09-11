-- Audit updates to moped_project_types

-- Update and add audit columns to moped_project_types
ALTER TABLE moped_project_types RENAME COLUMN date_added TO created_at;
ALTER TABLE moped_project_types ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE moped_project_types RENAME COLUMN added_by TO created_by_user_id;
ALTER TABLE moped_project_types ADD COLUMN updated_at TIMESTAMPTZ
NOT NULL DEFAULT now();
ALTER TABLE moped_project_types ADD COLUMN updated_by_user_id INTEGER
NULL;

COMMENT ON COLUMN moped_project_types.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_project_types.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_project_types.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_project_types.updated_by_user_id IS 'ID of the user who last updated the record';

-- Add fk constraints on user audit fields on moped_project_types
ALTER TABLE moped_project_types
ADD CONSTRAINT project_types_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_types_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add triggers to update audit fields on moped_project_types and parent project on insert or update of moped_project_types
CREATE TRIGGER update_moped_project_types_and_project_audit_fields
BEFORE INSERT OR UPDATE ON moped_project_types
FOR EACH ROW
EXECUTE FUNCTION update_self_and_project_updated_audit_fields();

COMMENT ON TRIGGER update_moped_project_types_and_project_audit_fields ON moped_project_types IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_project_types table.';
