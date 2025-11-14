-- Most recent migration: moped-database/migrations/default/1761074353404_ecapris_funding/up.sql

CREATE OR REPLACE VIEW project_funding_view AS SELECT
    moped_project.project_id,
    combined_project_funding_view.id AS proj_funding_id,
    combined_project_funding_view.amount AS funding_amount,
    combined_project_funding_view.description AS funding_description,
    combined_project_funding_view.fdu AS fund_dept_unit,
    combined_project_funding_view.created_at,
    combined_project_funding_view.updated_at,
    combined_project_funding_view.source_name AS funding_source_name,
    combined_project_funding_view.program_name AS funding_program_name,
    combined_project_funding_view.status_name AS funding_status_name
FROM moped_project
LEFT JOIN combined_project_funding_view ON moped_project.project_id = combined_project_funding_view.project_id OR moped_project.ecapris_subproject_id = combined_project_funding_view.ecapris_subproject_id AND moped_project.ecapris_subproject_id IS NOT NULL
WHERE TRUE AND moped_project.is_deleted = FALSE;
