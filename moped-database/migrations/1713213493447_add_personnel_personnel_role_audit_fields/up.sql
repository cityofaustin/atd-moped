-- Audit updates to moped_proj_personnel

-- Update and add audit columns to moped_proj_personnel
ALTER TABLE moped_proj_personnel RENAME COLUMN date_added TO created_at;
ALTER TABLE moped_proj_personnel ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE moped_proj_personnel RENAME COLUMN added_by TO created_by_user_id;
ALTER TABLE moped_proj_personnel ADD COLUMN updated_at TIMESTAMPTZ
 NOT NULL DEFAULT now();
ALTER TABLE moped_proj_personnel ADD COLUMN updated_by_user_id INTEGER
 NULL;

COMMENT ON COLUMN moped_proj_personnel.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_proj_personnel.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_proj_personnel.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_personnel.updated_by_user_id IS 'ID of the user who last updated the record';

-- Add fk constraints on user audit fields on moped_proj_personnel
ALTER TABLE moped_proj_personnel
ADD CONSTRAINT project_personnel_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_personnel_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add triggers to update audit fields on moped_proj_personnel and parent project on insert or update of moped_proj_personnel
CREATE TRIGGER update_moped_proj_personnel_and_project_audit_fields
BEFORE INSERT OR UPDATE ON moped_proj_personnel
FOR EACH ROW
EXECUTE FUNCTION update_self_and_project_updated_audit_fields();

COMMENT ON TRIGGER update_moped_proj_personnel_and_project_audit_fields ON moped_proj_personnel IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_personnel table.';

-- Audit updates to moped_proj_personnel_roles

-- Add audit columns to moped_proj_personnel_roles
ALTER TABLE moped_proj_personnel_roles ADD COLUMN created_at TIMESTAMPTZ
 NOT NULL DEFAULT now();
ALTER TABLE moped_proj_personnel_roles ADD COLUMN created_by_user_id INTEGER
 NULL;
ALTER TABLE moped_proj_personnel_roles ADD COLUMN updated_at TIMESTAMPTZ
 NOT NULL DEFAULT now();
ALTER TABLE moped_proj_personnel_roles ADD COLUMN updated_by_user_id INTEGER
 NULL;

COMMENT ON COLUMN moped_proj_personnel_roles.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_proj_personnel_roles.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_proj_personnel_roles.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_personnel_roles.updated_by_user_id IS 'ID of the user who last updated the record';

-- Add fk constraints on user audit fields on moped_proj_personnel_roles
ALTER TABLE moped_proj_personnel_roles
ADD CONSTRAINT project_personnel_roles_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_personnel_roles_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add trigger to update audit fields on moped_proj_personnel on insert or update of moped_proj_personnel_roles
CREATE TRIGGER update_moped_proj_personnel_roles_parent_audit_fields
BEFORE INSERT OR UPDATE ON moped_proj_personnel_roles
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name('moped_proj_personnel', 'project_personnel_id', 'project_personnel_id');

COMMENT ON TRIGGER update_moped_proj_personnel_roles_parent_audit_fields ON moped_proj_personnel_roles IS 'Trigger to execute the update_audit_fields_with_dynamic_parent_table_name function before each update operation on the moped_proj_personnel_roles table.';

-- Add trigger to update updated_at on insert or update of moped_proj_personnel_roles
CREATE TRIGGER set_moped_proj_personnel_roles_updated_at
BEFORE INSERT OR UPDATE ON moped_proj_personnel_roles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

