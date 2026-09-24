-- Drop trigger to update updated_at on insert or update of moped_proj_personnel_roles
DROP TRIGGER IF EXISTS set_moped_proj_personnel_roles_updated_at ON moped_proj_personnel_roles;

-- Drop trigger to update audit fields on moped_proj_personnel on insert or update of moped_proj_personnel_roles
DROP TRIGGER IF EXISTS update_moped_proj_personnel_roles_parent_audit_fields ON moped_proj_personnel_roles;

-- Drop fk constraints on user audit fields on moped_proj_personnel_roles
ALTER TABLE moped_proj_personnel_roles
DROP CONSTRAINT project_personnel_roles_created_by_fkey,
DROP CONSTRAINT project_personnel_roles_updated_by_fkey;

-- Drop audit columns on moped_proj_personnel_roles
ALTER TABLE moped_proj_personnel_roles
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_at,
DROP COLUMN updated_by_user_id;

-- Drop triggers to update audit fields on moped_proj_personnel and parent project on insert or update of moped_proj_personnel
DROP TRIGGER IF EXISTS update_moped_proj_personnel_and_project_audit_fields ON moped_proj_personnel;

-- Drop fk constraints on user audit fields on moped_proj_personnel
ALTER TABLE moped_proj_personnel
DROP CONSTRAINT project_personnel_created_by_fkey,
DROP CONSTRAINT project_personnel_updated_by_fkey;

-- Revert and remove audit columns to moped_proj_personnel
ALTER TABLE moped_proj_personnel
DROP COLUMN updated_at,
DROP COLUMN updated_by_user_id;

ALTER TABLE moped_proj_personnel
RENAME COLUMN created_at TO date_added;

ALTER TABLE moped_proj_personnel
ALTER COLUMN date_added SET DEFAULT clock_timestamp();

ALTER TABLE moped_proj_personnel
RENAME COLUMN created_by_user_id TO added_by;
