-- Drop new moped_proj_funding table columns and indexes
DROP INDEX IF EXISTS idx_moped_proj_funding_is_manual;
DROP INDEX IF EXISTS idx_moped_proj_funding_ecapris_subproject_id;

ALTER TABLE moped_proj_funding
DROP COLUMN IF EXISTS is_manual,
DROP COLUMN IF EXISTS ecapris_subproject_id;

-- Restore previous definition of combined_project_funding_view
DROP VIEW IF EXISTS combined_project_funding_view;

CREATE OR REPLACE VIEW combined_project_funding_view AS SELECT
    'moped_'::text || moped_proj_funding.proj_funding_id AS id,
    moped_proj_funding.proj_funding_id AS original_id,
    moped_proj_funding.created_at,
    moped_proj_funding.updated_at,
    moped_proj_funding.project_id,
    moped_proj_funding.fdu,
    moped_proj_funding.funding_amount AS amount,
    moped_proj_funding.funding_description AS description,
    moped_fund_sources.funding_source_name AS source_name,
    moped_fund_status.funding_status_name AS status_name,
    moped_fund_programs.funding_program_name AS program_name,
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
    'ecapris_'::text || ecapris_subproject_funding.id AS id,
    ecapris_subproject_funding.id AS original_id,
    ecapris_subproject_funding.created_at,
    ecapris_subproject_funding.updated_at,
    NULL::integer AS project_id,
    ecapris_subproject_funding.fdu,
    ecapris_subproject_funding.app AS amount,
    'Synced from eCAPRIS'::text AS description,
    NULL::text AS source_name,
    'Set up'::text AS status_name,
    NULL::text AS program_name,
    ecapris_subproject_funding.fao_id,
    ecapris_subproject_funding.ecapris_subproject_id,
    TRUE AS is_synced_from_ecapris
FROM ecapris_subproject_funding
WHERE NOT (EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu AND moped_proj_funding.is_deleted = FALSE
    ));
