-- Switch on sync for projects with ecapris_subproject_id set
UPDATE moped_project SET should_sync_ecapris_funding = TRUE
WHERE ecapris_subproject_id IS NOT NULL;

-- Add unique constraint on (fdu, project_id) in moped_proj_funding table so we prevent duplicates
ALTER TABLE moped_proj_funding
ADD CONSTRAINT moped_proj_funding_unique_fdu_project_id UNIQUE (fdu, project_id, is_deleted),
ADD COLUMN is_synced_from_ecapris BOOLEAN DEFAULT FALSE NOT NULL;

COMMENT ON CONSTRAINT moped_proj_funding_unique_fdu_project_id ON moped_proj_funding IS 'Ensures that each (fdu, project_id) pair is unique in the moped_proj_funding table.';
COMMENT ON COLUMN moped_proj_funding.is_synced_from_ecapris IS 'Indicates whether this funding record was synced from the eCAPRIS funding data source.';
