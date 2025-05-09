-- Drop triggers to update audit fields on moped_project_types and parent project on insert or update of moped_project_types
DROP TRIGGER IF EXISTS update_moped_project_types_and_project_audit_fields ON moped_project_types;

-- Drop fk constraints on user audit fields on moped_project_types
ALTER TABLE moped_project_types
DROP CONSTRAINT project_types_created_by_fkey,
DROP CONSTRAINT project_types_updated_by_fkey;

-- Revert and remove audit columns to moped_project_types
ALTER TABLE moped_project_types
DROP COLUMN updated_at,
DROP COLUMN updated_by_user_id;

ALTER TABLE moped_project_types
RENAME COLUMN created_at TO date_added;

ALTER TABLE moped_project_types
ALTER COLUMN date_added SET DEFAULT clock_timestamp();

ALTER TABLE moped_project_types
RENAME COLUMN created_by_user_id TO added_by;
