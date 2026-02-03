-- Restore previous version of project_funding_view
-- that uses moped_proj_funding directly

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
FROM moped_project mp
LEFT JOIN moped_proj_funding mpf ON mp.project_id = mpf.project_id
LEFT JOIN moped_fund_sources mfs ON mpf.funding_source_id = mfs.funding_source_id
LEFT JOIN moped_fund_programs mfp ON mpf.funding_program_id = mfp.funding_program_id
LEFT JOIN moped_fund_status mfst ON mpf.funding_status_id = mfst.funding_status_id
WHERE true AND mp.is_deleted = false AND mpf.is_deleted = false;
