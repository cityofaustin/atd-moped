-- Remove trigger to update audit fields on insert or update of moped_proj_component_work_types
DROP TRIGGER moped_proj_component_work_types_parent_audit_log_trigger ON moped_proj_component_work_types;
DROP TRIGGER set_moped_proj_component_work_types_updated_at ON moped_proj_component_work_types;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_work_types
DROP CONSTRAINT project_component_work_types_created_by_fkey,
DROP CONSTRAINT project_component_work_types_updated_by_fkey;

-- Remove audit columns to moped_proj_component_work_types
ALTER TABLE moped_proj_component_work_types
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;

-- Remove trigger to update audit fields on insert or update of moped_proj_component_tags
DROP TRIGGER moped_proj_component_tags_parent_audit_log_trigger ON moped_proj_component_tags;
DROP TRIGGER set_moped_proj_component_tags_updated_at ON moped_proj_component_tags;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_tags
DROP CONSTRAINT project_component_tags_created_by_fkey,
DROP CONSTRAINT project_component_tags_updated_by_fkey;

-- Add audit columns to moped_proj_component_tags
ALTER TABLE moped_proj_component_tags
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;

DROP FUNCTION update_component_attributes_parent_records_audit_logs;
