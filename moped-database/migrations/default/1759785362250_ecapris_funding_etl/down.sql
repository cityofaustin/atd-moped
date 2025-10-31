-- Remove unique constraint on (ecapris_funding_id, project_id, is_synced_from_ecapris) in moped_proj_funding table
ALTER TABLE moped_proj_funding
DROP CONSTRAINT IF EXISTS moped_proj_funding_unique_ecapris_funding_id_project_id,
DROP COLUMN IF EXISTS is_synced_from_ecapris;

-- Switch off sync for projects with ecapris_subproject_id set
UPDATE moped_project SET should_sync_ecapris_funding = FALSE
WHERE ecapris_subproject_id IS NOT NULL;
