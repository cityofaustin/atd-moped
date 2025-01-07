-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE VIEW project_funding_view AS
-- SELECT
-- 	mp.project_id,
-- 	mpf.proj_funding_id,
-- 	mpf.funding_amount,
-- 	mpf.funding_description,
-- 	mpf.fund_name,
-- 	mpf.fund_dept_unit,
-- 	mpf.created_at,
-- 	mpf.updated_at,
-- 	mfs.funding_source_name,
-- 	mfp.funding_program_name,
-- 	mfst.funding_status_name
-- FROM
-- 	moped_project mp
-- 	LEFT JOIN moped_proj_funding mpf ON mpf.project_id = mp.project_id
-- 	LEFT JOIN moped_fund_sources mfs ON mfs.funding_source_id = mpf.funding_source_id
-- 	LEFT JOIN moped_fund_programs mfp ON mfp.funding_program_id = mpf.funding_program_id
-- 	LEFT JOIN moped_fund_status mfst ON mfst.funding_status_id = mpf.funding_status_id
-- WHERE
-- 	TRUE
-- 	AND mp.is_deleted = FALSE
-- 	AND mpf.is_deleted = FALSE;
