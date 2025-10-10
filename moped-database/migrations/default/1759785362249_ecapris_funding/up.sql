-- Add funding sync tracking to projects table
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_funding BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN moped_project.should_sync_ecapris_funding IS 'Indicates if project funding should be synced from eCAPRIS';
-- Fix eCAPRIS name in existing comment
COMMENT ON COLUMN moped_project.should_sync_ecapris_statuses IS 'Indicates if project statuses should be synced from eCAPRIS';

-- Update moped_proj_funding table
ALTER TABLE moped_proj_funding
ADD COLUMN ecapris_funding_id INTEGER,
ADD COLUMN is_legacy_funding_record BOOLEAN DEFAULT FALSE,
ADD COLUMN is_editable BOOLEAN GENERATED ALWAYS AS (ecapris_funding_id IS NULL) STORED,
ADD COLUMN fdu TEXT DEFAULT NULL;

COMMENT ON COLUMN moped_proj_funding.ecapris_funding_id IS 'References the eCAPRIS FDU unique fao_id if applicable';
COMMENT ON COLUMN moped_proj_funding.is_legacy_funding_record IS 'Indicates if the funding record was created before eCAPRIS sync integration (Nov 2025)';

-- Mark all existing funding records as legacy before eCAPRIS sync integration
UPDATE moped_proj_funding
SET is_legacy_funding_record = TRUE;

-- Add comments on other existing moped_proj_funding columns
COMMENT ON COLUMN moped_proj_funding.proj_funding_id IS 'Primary key for the project funding record';
COMMENT ON COLUMN moped_proj_funding.created_by_user_id IS 'ID of the user who last created the record';
COMMENT ON COLUMN moped_proj_funding.created_at IS 'Timestamp when the record was last created';
COMMENT ON COLUMN moped_proj_funding.project_id IS 'References the project this funding record is associated with';
COMMENT ON COLUMN moped_proj_funding.funding_source_id IS 'References the funding source for this funding record';
COMMENT ON COLUMN moped_proj_funding.funding_program_id IS 'References the funding program for this funding record';
COMMENT ON COLUMN moped_proj_funding.funding_amount IS 'The amount of funding allocated from this funding source';
COMMENT ON COLUMN moped_proj_funding.funding_description IS 'A description of the funding source';
COMMENT ON COLUMN moped_proj_funding.funding_status_id IS 'References the current status of this funding record';
COMMENT ON COLUMN moped_proj_funding.fund IS 'Legacy JSONB object containing additional fund details from eCAPRIS (Socrata jega-nqf6)';
COMMENT ON COLUMN moped_proj_funding.dept_unit IS 'Legacy JSONB object containing additional department/unit details from eCAPRIS (Socrata bgrt-2m2z)';
COMMENT ON COLUMN moped_proj_funding.is_editable IS 'Indicates if the funding record is editable (false if linked to an eCAPRIS funding record)';
COMMENT ON COLUMN moped_proj_funding.fdu IS 'The FDU (Fund-Dept-Unit) code associated with this funding record';
