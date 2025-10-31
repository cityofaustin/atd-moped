-- Switch on sync for projects with ecapris_subproject_id set
UPDATE moped_project SET should_sync_ecapris_funding = TRUE
WHERE ecapris_subproject_id IS NOT NULL;

-- Add unique constraint on (fdu, project_id) in moped_ecapris_funding table so we prevent duplicates
ALTER TABLE moped_proj_funding
ADD CONSTRAINT unique_fdu_project_id UNIQUE (fdu, project_id);

COMMENT ON CONSTRAINT unique_fdu_project_id ON moped_proj_funding IS 'Ensures that each (fdu, project_id) pair is unique in the moped_proj_funding table.';

ALTER TABLE moped_proj_funding ADD COLUMN is_synced BOOLEAN DEFAULT FALSE NOT NULL;
COMMENT ON COLUMN moped_proj_funding.is_synced IS 'Indicates whether this funding record was synced from the eCAPRIS funding data source.';
