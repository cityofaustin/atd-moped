-- Remove funding sync flag from projects table
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_funding;

-- Remove added columns from moped_proj_funding table
ALTER TABLE moped_proj_funding
DROP COLUMN ecapris_funding_id,
DROP COLUMN is_legacy_funding_record;
