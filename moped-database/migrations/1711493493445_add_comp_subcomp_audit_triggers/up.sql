-- Audit updates to moped_proj_components_subcomponents
-- Add audit columns to moped_proj_components_subcomponents
ALTER TABLE moped_proj_components_subcomponents
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id INT4 NULL,
ADD COLUMN updated_by_user_id INT4 NULL,
ADD COLUMN updated_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN moped_proj_components_subcomponents.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_components_subcomponents.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_proj_components_subcomponents.updated_by_user_id IS 'ID of the user who last updated the record';
COMMENT ON COLUMN moped_proj_components_subcomponents.updated_at IS 'Timestamp when the record was last updated';

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_components_subcomponents
ADD CONSTRAINT project_component_subcomponent_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_component_subcomponent_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Add triggers to update audit fields on insert or update of moped_proj_components_subcomponents
CREATE TRIGGER moped_proj_component_subcomponents_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_components_subcomponents
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "project_component_id");

COMMENT ON TRIGGER moped_proj_component_subcomponents_parent_audit_log_trigger ON moped_proj_components_subcomponents IS 'Trigger to update parent project and component audit fields';

CREATE TRIGGER set_moped_proj_component_subcomponents_updated_at
BEFORE INSERT OR UPDATE ON moped_proj_components_subcomponents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
