CREATE OR REPLACE VIEW combined_project_notes AS
SELECT
    project_note_id,
    project_note,
    created_at,
    project_id,
    created_by_user_id,
    project_note_type,
    is_deleted,
    phase_id,
    updated_at,
    updated_by_user_id,
    true AS is_editable,
    null AS ecapris_subproject_id
FROM
    moped_proj_notes
UNION ALL
SELECT
    id AS project_note_id,
    sub_project_status_desc AS project_note,
    review_timestamp AS created_at,
    null::integer AS project_id, -- You may need to adjust this mapping
    created_by_user_id,
    3 AS project_note_type, -- Setting to 3 as requested
    false AS is_deleted,
    null::integer AS phase_id,
    updated_at,
    updated_by_user_id,
    false AS is_editable,
    ecapris_subproject_id
FROM
    ecapris_subproject_statuses;

-- TODO Update trigger to match user by email to run on update too?
