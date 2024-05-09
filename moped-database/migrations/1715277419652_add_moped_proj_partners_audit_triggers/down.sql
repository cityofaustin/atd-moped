-- Drop triggers to update audit fields on moped_proj_partners and parent project on insert or update of moped_proj_partners
DROP TRIGGER IF EXISTS update_moped_proj_partners_and_project_audit_fields ON moped_proj_partners;

-- Drop fk constraints on user audit fields on moped_proj_partners
ALTER TABLE moped_proj_partners
DROP CONSTRAINT project_types_created_by_fkey,
DROP CONSTRAINT project_types_updated_by_fkey;

-- Revert and remove audit columns to moped_proj_partners
ALTER TABLE moped_proj_partners
DROP COLUMN updated_at,
DROP COLUMN updated_by_user_id;

ALTER TABLE moped_proj_partners
RENAME COLUMN created_at TO date_added;

ALTER TABLE moped_proj_partners
ALTER COLUMN date_added SET DEFAULT clock_timestamp();

ALTER TABLE moped_proj_partners
RENAME COLUMN created_by_user_id TO added_by;
