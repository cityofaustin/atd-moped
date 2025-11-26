-- Drop new moped_proj_funding table columns and indexes
DROP INDEX IF EXISTS idx_moped_proj_funding_is_manual;
DROP INDEX IF EXISTS idx_moped_proj_funding_ecapris_subproject_id;

ALTER TABLE moped_proj_funding
DROP COLUMN IF EXISTS is_manual,
DROP COLUMN IF EXISTS ecapris_subproject_id;
