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
ADD COLUMN fdu TEXT DEFAULT NULL,
ADD COLUMN unit_long_name TEXT DEFAULT NULL;

COMMENT ON COLUMN moped_proj_funding.ecapris_funding_id IS 'References the eCAPRIS FDU unique fao_id if applicable';
COMMENT ON COLUMN moped_proj_funding.is_legacy_funding_record IS 'Indicates if the funding record was created before eCAPRIS sync integration (Nov 2025)';

-- Mark all existing funding records as legacy before eCAPRIS sync integration launches
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
COMMENT ON COLUMN moped_proj_funding.unit_long_name IS 'The long name of the unit associated with this funding record';

-- Populate new fdu column based on existing fund_dept_unit data if available and 
-- populate unit_long_name from dept_unit JSONB
-- Note: fund_dept_unit is a generated column that is null if fund or dept_unit is null
UPDATE moped_proj_funding
SET
    fdu = fund_dept_unit,
    unit_long_name = (dept_unit ->> 'unit_long_name')
WHERE fund_dept_unit IS NOT NULL;

-- Drop and recreate view to use new fdu column instead of fund_dept_unit
DROP VIEW IF EXISTS project_funding_view;

CREATE OR REPLACE VIEW project_funding_view AS SELECT
    mp.project_id,
    mpf.proj_funding_id,
    mpf.funding_amount,
    mpf.funding_description,
    mpf.fdu AS fund_dept_unit,
    mpf.created_at,
    mpf.updated_at,
    mfs.funding_source_name,
    mfp.funding_program_name,
    mfst.funding_status_name
FROM moped_project AS mp
LEFT JOIN moped_proj_funding AS mpf ON mp.project_id = mpf.project_id
LEFT JOIN moped_fund_sources AS mfs ON mpf.funding_source_id = mfs.funding_source_id
LEFT JOIN moped_fund_programs AS mfp ON mpf.funding_program_id = mfp.funding_program_id
LEFT JOIN moped_fund_status AS mfst ON mpf.funding_status_id = mfst.funding_status_id
WHERE TRUE AND mp.is_deleted = FALSE AND mpf.is_deleted = FALSE;
