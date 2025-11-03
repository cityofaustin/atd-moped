-- Remove funding sync flag from projects table
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_funding;

-- Remove added columns from moped_proj_funding table
ALTER TABLE moped_proj_funding
DROP COLUMN ecapris_funding_id,
DROP COLUMN is_legacy_funding_record,
DROP COLUMN fdu,
DROP COLUMN unit_long_name;

-- Drop ecapris_subproject_funding table
DROP TABLE IF EXISTS public.ecapris_subproject_funding;

-- Drop combined_project_funding_view
DROP VIEW IF EXISTS combined_project_funding_view;

-- Restore previous view to use fund_dept_unit column
DROP VIEW IF EXISTS project_funding_view;

CREATE OR REPLACE VIEW project_funding_view AS SELECT
    mp.project_id,
    mpf.proj_funding_id,
    mpf.funding_amount,
    mpf.funding_description,
    mpf.fund_dept_unit,
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
WHERE true AND mp.is_deleted = false AND mpf.is_deleted = false;
