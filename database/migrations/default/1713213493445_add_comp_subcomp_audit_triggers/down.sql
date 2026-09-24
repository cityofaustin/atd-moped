-- Remove trigger to update audit fields on insert or update of moped_proj_component_tags
DROP TRIGGER IF EXISTS moped_proj_component_subcomponents_parent_audit_log_trigger ON moped_proj_components_subcomponents;
DROP TRIGGER IF EXISTS set_moped_proj_component_subcomponents_updated_at ON moped_proj_components_subcomponents;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_components_subcomponents
DROP CONSTRAINT project_component_subcomponent_created_by_fkey,
DROP CONSTRAINT project_component_subcomponent_updated_by_fkey;

-- Add audit columns to moped_proj_component_tags
ALTER TABLE moped_proj_components_subcomponents
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;
