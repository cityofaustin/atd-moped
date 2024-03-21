-- Audit updates to moped_proj_component_work_types
-- Add audit columns to moped_proj_component_work_types
ALTER TABLE moped_proj_component_work_types
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_work_types
ADD CONSTRAINT project_component_work_types_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_component_work_types_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add trigger to update audit fields on insert or update of moped_proj_component_work_types
CREATE TRIGGER moped_proj_component_work_types_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_work_types
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();

-- Audit updates to moped_proj_component_tags
-- Add audit columns to moped_proj_component_tags
ALTER TABLE moped_proj_component_tags
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_tags
ADD CONSTRAINT project_component_tags_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_component_tags_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add triggers to update audit fields on insert or update of moped_proj_component_tags
CREATE TRIGGER moped_proj_component_tags_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_tags
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
