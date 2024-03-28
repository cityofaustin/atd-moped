-- Creating or replacing a function to update audit logs in parent records
CREATE OR REPLACE FUNCTION update_component_attributes_parent_records_audit_logs()
RETURNS TRIGGER AS $$
DECLARE
  project_id_variable INTEGER;
  query TEXT;
BEGIN
  
  -- Update the project component with the current timestamp and user ID
  UPDATE moped_proj_components
  SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
  WHERE project_component_id = NEW.project_component_id
  RETURNING project_id INTO project_id_variable;

  -- Update the parent project record with the current timestamp and user ID
  UPDATE moped_project
  SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
  WHERE project_id = project_id_variable;

  -- Return the updated record
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_component_attributes_parent_records_audit_logs() IS 'Function to update parent audit fields on update/insert into component attribute tables';

-- Audit updates to moped_proj_component_work_types
-- Add audit columns to moped_proj_component_work_types
ALTER TABLE moped_proj_component_work_types
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id INT4 NULL,
ADD COLUMN updated_by_user_id INT4 NULL,
ADD COLUMN updated_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN moped_proj_component_work_types.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_component_work_types.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_proj_component_work_types.updated_by_user_id IS 'ID of the user who last updated the record';
COMMENT ON COLUMN moped_proj_component_work_types.updated_at IS 'Timestamp when the record was last updated';

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_work_types
ADD CONSTRAINT project_component_work_types_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_component_work_types_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add triggers to update audit fields on insert or update of moped_proj_component_work_types
CREATE TRIGGER moped_proj_component_work_types_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_work_types
FOR EACH ROW
EXECUTE FUNCTION update_component_attributes_parent_records_audit_logs();

COMMENT ON TRIGGER moped_proj_component_work_types_parent_audit_log_trigger ON moped_proj_component_work_types IS 'Trigger to execute the update_component_attributes_parent_records_audit_logs function before each update operation on the moped_proj_component_work_types table.';

CREATE TRIGGER set_moped_proj_component_work_types_updated_at
BEFORE INSERT OR UPDATE ON moped_proj_component_work_types
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Audit updates to moped_proj_component_tags
-- Add audit columns to moped_proj_component_tags
ALTER TABLE moped_proj_component_tags
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id INT4 NULL,
ADD COLUMN updated_by_user_id INT4 NULL,
ADD COLUMN updated_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN moped_proj_component_tags.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_component_tags.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_proj_component_tags.updated_by_user_id IS 'ID of the user who last updated the record';
COMMENT ON COLUMN moped_proj_component_tags.updated_at IS 'Timestamp when the record was last updated';

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_tags
ADD CONSTRAINT project_component_tags_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_component_tags_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add triggers to update audit fields on insert or update of moped_proj_component_tags
CREATE TRIGGER moped_proj_component_tags_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_tags
FOR EACH ROW
EXECUTE FUNCTION update_component_attributes_parent_records_audit_logs();

COMMENT ON TRIGGER moped_proj_component_tags_parent_audit_log_trigger ON moped_proj_component_tags IS 'Trigger to execute the update_component_attributes_parent_records_audit_logs function before each update operation on the moped_proj_component_tags table.';

CREATE TRIGGER set_moped_proj_component_tags_updated_at
BEFORE INSERT OR UPDATE ON moped_proj_component_tags
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
