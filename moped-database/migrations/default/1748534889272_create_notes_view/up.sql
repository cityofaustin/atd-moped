CREATE OR REPLACE VIEW combined_project_notes AS
SELECT
    ('M' || moped_proj_notes.project_note_id) AS id,
    moped_proj_notes.project_note,
    moped_proj_notes.created_at,
    moped_proj_notes.project_id,
    (moped_users.first_name || ' ' || moped_users.last_name) AS author,
    moped_proj_notes.project_note_type,
    moped_proj_notes.is_deleted,
    moped_proj_notes.phase_id,
    TRUE AS is_editable,
    NULL AS ecapris_subproject_id
FROM
    moped_proj_notes
LEFT JOIN moped_users ON moped_proj_notes.created_by_user_id = moped_users.user_id
UNION ALL
SELECT
    ('E' || ecapris_subproject_statuses.id) AS id,
    ecapris_subproject_statuses.sub_project_status_desc AS project_note,
    ecapris_subproject_statuses.review_timestamp AS created_at,
    NULL::integer AS project_id,
    COALESCE((moped_users.first_name || ' ' || moped_users.last_name), LOWER(ecapris_subproject_statuses.reviewed_by_email), ecapris_subproject_statuses.reviewed_by_name) AS author,
    3 AS project_note_type,
    FALSE AS is_deleted,
    NULL AS phase_id,
    FALSE AS is_editable,
    ecapris_subproject_statuses.ecapris_subproject_id
FROM
    ecapris_subproject_statuses
LEFT JOIN moped_users ON ecapris_subproject_statuses.created_by_user_id = moped_users.user_id
ORDER BY
    created_at DESC;
