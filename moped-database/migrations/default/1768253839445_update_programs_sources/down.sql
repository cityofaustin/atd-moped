-- New sources and programs will be soft-deleted in the future if needed

-- No down migration included for source and program updates. We can reference original values 
-- in the activity log and make another up migration if we need to refine more later.

-- Drop trigger and then trigger function
DROP TRIGGER IF EXISTS match_ecapris_funding_keys_trigger ON ecapris_subproject_funding;
DROP FUNCTION IF EXISTS match_ecapris_funding_to_source_and_programs_foreign_keys ();

-- Revert combined funding view to previous version without eCAPRIS source and program info
DROP VIEW IF EXISTS combined_project_funding_view;

CREATE OR REPLACE VIEW combined_project_funding_view AS SELECT
    'moped_'::text || moped_proj_funding.proj_funding_id AS id,
    moped_proj_funding.proj_funding_id AS original_id,
    moped_proj_funding.created_at,
    moped_proj_funding.updated_at,
    moped_proj_funding.project_id,
    moped_proj_funding.fdu,
    moped_proj_funding.unit_long_name,
    moped_proj_funding.funding_amount AS amount,
    moped_proj_funding.funding_description AS description,
    moped_fund_sources.funding_source_name AS source_name,
    moped_proj_funding.funding_source_id,
    moped_fund_status.funding_status_name AS status_name,
    moped_proj_funding.funding_status_id,
    moped_fund_programs.funding_program_name AS program_name,
    moped_proj_funding.funding_program_id,
    NULL::integer AS fao_id,
    NULL::text AS ecapris_subproject_id,
    FALSE AS is_synced_from_ecapris
FROM moped_proj_funding
LEFT JOIN moped_fund_status ON moped_proj_funding.funding_status_id = moped_fund_status.funding_status_id
LEFT JOIN moped_fund_sources ON moped_proj_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
WHERE moped_proj_funding.is_deleted = FALSE
UNION ALL
SELECT
    (('ecapris_'::text || ecapris_subproject_funding.id) || '_moped_'::text) || moped_project.project_id AS id,
    ecapris_subproject_funding.id AS original_id,
    ecapris_subproject_funding.created_at,
    ecapris_subproject_funding.updated_at,
    moped_project.project_id,
    ecapris_subproject_funding.fdu,
    ecapris_subproject_funding.unit_long_name,
    ecapris_subproject_funding.app AS amount,
    NULL::text AS description,
    NULL::text AS source_name,
    NULL::integer AS funding_source_id,
    'Set up'::text AS status_name,
    5 AS funding_status_id,
    NULL::text AS program_name,
    NULL::integer AS funding_program_id,
    ecapris_subproject_funding.fao_id,
    ecapris_subproject_funding.ecapris_subproject_id,
    TRUE AS is_synced_from_ecapris
FROM ecapris_subproject_funding
INNER JOIN moped_project ON ecapris_subproject_funding.ecapris_subproject_id = moped_project.ecapris_subproject_id
WHERE NOT (EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu AND moped_proj_funding.project_id = moped_project.project_id AND moped_proj_funding.is_deleted = FALSE
    ));

-- Drop added columns from ecapris_subproject_funding
ALTER TABLE ecapris_subproject_funding
DROP COLUMN IF EXISTS bond_year,
DROP COLUMN IF EXISTS funding_source_id,
DROP COLUMN IF EXISTS funding_program_id;
