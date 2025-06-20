-- Most recent migration: moped-database/migrations/default/1748534889272_create_notes_view/up.sql

CREATE OR REPLACE VIEW combined_project_notes AS SELECT
    'moped_'::text || moped_proj_notes.project_note_id AS id,
    moped_proj_notes.project_note_id AS original_id,
    moped_proj_notes.project_note,
    moped_proj_notes.created_at,
    moped_proj_notes.created_by_user_id,
    moped_proj_notes.project_id,
    (moped_users.first_name || ' '::text) || moped_users.last_name AS author,
    moped_note_types.name AS note_type_name,
    moped_note_types.slug AS note_type_slug,
    moped_phases.phase_name,
    moped_phases.phase_key,
    moped_proj_notes.is_deleted,
    moped_proj_notes.phase_id,
    true AS is_editable,
    null::text AS ecapris_subproject_id
FROM moped_proj_notes
LEFT JOIN moped_users ON moped_proj_notes.created_by_user_id = moped_users.user_id
LEFT JOIN moped_note_types ON moped_proj_notes.project_note_type = moped_note_types.id
LEFT JOIN moped_phases ON moped_proj_notes.phase_id = moped_phases.phase_id
WHERE moped_proj_notes.is_deleted = false
UNION ALL
SELECT
    'ecapris_'::text || ecapris_subproject_statuses.id AS id,
    ecapris_subproject_statuses.id AS original_id,
    ecapris_subproject_statuses.sub_project_status_desc AS project_note,
    ecapris_subproject_statuses.review_timestamp AS created_at,
    ecapris_subproject_statuses.created_by_user_id,
    null::integer AS project_id,
    COALESCE(
        (moped_users.first_name || ' '::text) || moped_users.last_name,
        CASE
            WHEN ecapris_subproject_statuses.reviewed_by_name ~~ '%,%'::text THEN (TRIM(BOTH FROM SPLIT_PART(ecapris_subproject_statuses.reviewed_by_name, ','::text, 2)) || ' '::text) || TRIM(BOTH FROM SPLIT_PART(ecapris_subproject_statuses.reviewed_by_name, ','::text, 1))
            ELSE LOWER(ecapris_subproject_statuses.reviewed_by_name)
        END
    ) AS author,
    moped_note_types.name AS note_type_name,
    moped_note_types.slug AS note_type_slug,
    null::text AS phase_name,
    null::text AS phase_key,
    false AS is_deleted,
    null::integer AS phase_id,
    false AS is_editable,
    ecapris_subproject_statuses.ecapris_subproject_id
FROM ecapris_subproject_statuses
LEFT JOIN moped_users ON ecapris_subproject_statuses.created_by_user_id = moped_users.user_id
LEFT JOIN moped_note_types ON moped_note_types.slug = 'ecapris_status_update'::text;
