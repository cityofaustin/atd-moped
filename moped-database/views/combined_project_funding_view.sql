-- Most recent migration: moped-database/migrations/default/1767973659237_add_is_manual_funding_view/up.sql

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
    moped_proj_funding.ecapris_funding_id AS fao_id,
    moped_proj_funding.ecapris_subproject_id,
    false AS is_synced_from_ecapris,
    moped_proj_funding.is_manual
FROM moped_proj_funding
LEFT JOIN moped_fund_status ON moped_proj_funding.funding_status_id = moped_fund_status.funding_status_id
LEFT JOIN moped_fund_sources ON moped_proj_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
WHERE moped_proj_funding.is_deleted = false
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
    null::text AS description,
    null::text AS source_name,
    null::integer AS funding_source_id,
    'Set up'::text AS status_name,
    5 AS funding_status_id,
    null::text AS program_name,
    null::integer AS funding_program_id,
    ecapris_subproject_funding.fao_id,
    ecapris_subproject_funding.ecapris_subproject_id,
    true AS is_synced_from_ecapris,
    false AS is_manual
FROM ecapris_subproject_funding
JOIN moped_project ON ecapris_subproject_funding.ecapris_subproject_id = moped_project.ecapris_subproject_id
WHERE NOT (EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu AND moped_proj_funding.project_id = moped_project.project_id AND moped_proj_funding.is_deleted = false
    ));
