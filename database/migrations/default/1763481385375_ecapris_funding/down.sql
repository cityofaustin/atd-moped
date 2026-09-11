-- Drop combined_project_funding_view
DROP VIEW IF EXISTS combined_project_funding_view;

-- Remove funding sync flag from projects table
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_funding;

-- Remove added columns from moped_proj_funding table
ALTER TABLE moped_proj_funding
DROP COLUMN ecapris_funding_id,
DROP COLUMN is_legacy_funding_record,
DROP COLUMN fdu,
DROP COLUMN unit_long_name;

-- Drop added indexes
DROP INDEX IF EXISTS idx_moped_proj_funding_fdu_not_deleted;
DROP INDEX IF EXISTS idx_moped_proj_funding_project_id;
DROP INDEX IF EXISTS idx_moped_proj_funding_status_id;
DROP INDEX IF EXISTS idx_moped_proj_funding_source_id;
DROP INDEX IF EXISTS idx_moped_proj_funding_program_id;

-- Drop ecapris_subproject_funding table
DROP TABLE IF EXISTS public.ecapris_subproject_funding;
