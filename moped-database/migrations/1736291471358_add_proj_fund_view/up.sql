CREATE OR REPLACE VIEW project_funding_view AS
SELECT
    mp.project_id,
    mpf.proj_funding_id,
    mpf.funding_amount,
    mpf.funding_description,
    mpf.fund_name,
    mpf.fund_dept_unit,
    mpf.created_at,
    mpf.updated_at,
    mfs.funding_source_name,
    mfp.funding_program_name,
    mfst.funding_status_name
FROM
    moped_project AS mp
LEFT JOIN moped_proj_funding AS mpf ON mp.project_id = mpf.project_id
LEFT JOIN moped_fund_sources AS mfs ON mpf.funding_source_id = mfs.funding_source_id
LEFT JOIN moped_fund_programs AS mfp ON mpf.funding_program_id = mfp.funding_program_id
LEFT JOIN moped_fund_status AS mfst ON mpf.funding_status_id = mfst.funding_status_id
WHERE
    TRUE
    AND mp.is_deleted = FALSE
    AND mpf.is_deleted = FALSE;
