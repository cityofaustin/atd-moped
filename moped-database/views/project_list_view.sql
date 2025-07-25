-- Most recent migration: moped-database/migrations/default/1748534889273_add_author_to_plv/up.sql

CREATE OR REPLACE VIEW project_list_view AS WITH project_person_list_lookup AS (
    SELECT
        mpp.project_id,
        string_agg(DISTINCT concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ','::text) AS project_team_members
    FROM moped_proj_personnel mpp
    JOIN moped_users mu ON mpp.user_id = mu.user_id
    JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
    JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
    WHERE mpp.is_deleted = false AND mppr.is_deleted = false
    GROUP BY mpp.project_id
),

funding_sources_lookup AS (
    SELECT
        mpf.project_id,
        string_agg(DISTINCT mfs.funding_source_name, ', '::text ORDER BY mfs.funding_source_name) AS funding_source_name,
        string_agg(DISTINCT mfp.funding_program_name, ', '::text ORDER BY mfp.funding_program_name) AS funding_program_names,
        string_agg(
            DISTINCT
            CASE
                WHEN mfs.funding_source_name IS NOT null AND mfp.funding_program_name IS NOT null THEN concat(mfs.funding_source_name, ' - ', mfp.funding_program_name)
                WHEN mfs.funding_source_name IS NOT null THEN mfs.funding_source_name
                WHEN mfp.funding_program_name IS NOT null THEN mfp.funding_program_name
                ELSE null::text
            END, ', '::text ORDER BY (
                CASE
                    WHEN mfs.funding_source_name IS NOT null AND mfp.funding_program_name IS NOT null THEN concat(mfs.funding_source_name, ' - ', mfp.funding_program_name)
                    WHEN mfs.funding_source_name IS NOT null THEN mfs.funding_source_name
                    WHEN mfp.funding_program_name IS NOT null THEN mfp.funding_program_name
                    ELSE null::text
                END
            )
        ) AS funding_source_and_program_names
    FROM moped_proj_funding mpf
    LEFT JOIN moped_fund_sources mfs ON mpf.funding_source_id = mfs.funding_source_id
    LEFT JOIN moped_fund_programs mfp ON mpf.funding_program_id = mfp.funding_program_id
    WHERE mpf.is_deleted = false
    GROUP BY mpf.project_id
),

child_project_lookup AS (
    SELECT
        jsonb_agg(children.project_id) AS children_project_ids,
        children.parent_project_id AS parent_id
    FROM moped_project children
    JOIN moped_project parent ON children.parent_project_id = parent.project_id
    WHERE children.is_deleted = false
    GROUP BY children.parent_project_id
),

work_activities AS (
    SELECT
        mpwa.project_id,
        string_agg(task_order_objects.task_order_object ->> 'display_name'::text, ', '::text) AS task_order_names,
        string_agg(task_order_objects.task_order_object ->> 'task_order'::text, ', '::text) AS task_order_names_short,
        jsonb_agg(DISTINCT task_order_objects.task_order_object) FILTER (WHERE task_order_objects.task_order_object IS NOT null) AS task_orders,
        string_agg(DISTINCT mpwa.workgroup_contractor, ', '::text) AS workgroup_contractors,
        string_agg(mpwa.contract_number, ', '::text) AS contract_numbers
    FROM moped_proj_work_activity mpwa
    LEFT JOIN LATERAL jsonb_array_elements(mpwa.task_orders) task_order_objects (task_order_object) ON true
    WHERE 1 = 1 AND mpwa.is_deleted = false
    GROUP BY mpwa.project_id
),

moped_proj_components_subtypes AS (
    SELECT
        mpc.project_id,
        string_agg(DISTINCT mc.component_name_full, ', '::text) AS components
    FROM moped_proj_components mpc
    LEFT JOIN moped_components mc ON mpc.component_id = mc.component_id
    WHERE mpc.is_deleted = false
    GROUP BY mpc.project_id
),

project_district_association AS (
    WITH project_council_district_map AS (
        SELECT DISTINCT
            moped_project.project_id,
            features_council_districts.council_district_id
        FROM moped_project
        LEFT JOIN moped_proj_components ON moped_project.project_id = moped_proj_components.project_id
        LEFT JOIN features ON moped_proj_components.project_component_id = features.component_id
        LEFT JOIN features_council_districts ON features.id = features_council_districts.feature_id
        WHERE features.is_deleted IS false AND moped_proj_components.is_deleted IS false
    ),

parent_child_project_map AS (
        SELECT
            parent_projects.project_id,
            unnest(ARRAY[parent_projects.project_id] || array_agg(child_projects.project_id)) AS self_and_children_project_ids
        FROM moped_project parent_projects
        LEFT JOIN moped_project child_projects ON parent_projects.project_id = child_projects.parent_project_id
        GROUP BY parent_projects.project_id
        ORDER BY parent_projects.project_id
    )

    SELECT
        projects.project_id,
        jsonb_agg(DISTINCT project_districts.council_district_id) FILTER (WHERE project_districts.council_district_id IS NOT null) AS project_council_districts,
        jsonb_agg(DISTINCT project_and_children_districts.council_district_id) FILTER (WHERE project_and_children_districts.council_district_id IS NOT null) AS project_and_child_project_council_districts
    FROM parent_child_project_map projects
    LEFT JOIN project_council_district_map project_and_children_districts ON projects.self_and_children_project_ids = project_and_children_districts.project_id
    LEFT JOIN project_council_district_map project_districts ON projects.project_id = project_districts.project_id
    GROUP BY projects.project_id
),

min_confirmed_phase_dates AS (
    WITH min_dates AS (
        SELECT
            phases.project_id,
            min(phases.phase_start) AS min_date
        FROM moped_proj_phases phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_start IS NOT null AND phases.is_phase_start_confirmed = true AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
        UNION ALL
        SELECT
            phases.project_id,
            min(phases.phase_end) AS min_date
        FROM moped_proj_phases phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_end IS NOT null AND phases.is_phase_end_confirmed = true AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
    )

    SELECT
        min_dates.project_id,
        min(min_dates.min_date) AS min_phase_date
    FROM min_dates
    GROUP BY min_dates.project_id
),

min_estimated_phase_dates AS (
    WITH min_dates AS (
        SELECT
            phases.project_id,
            min(phases.phase_start) AS min_date
        FROM moped_proj_phases phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_start IS NOT null AND phases.is_phase_start_confirmed = false AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
        UNION ALL
        SELECT
            phases.project_id,
            min(phases.phase_end) AS min_date
        FROM moped_proj_phases phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_end IS NOT null AND phases.is_phase_end_confirmed = false AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
    )

    SELECT
        min_dates.project_id,
        min(min_dates.min_date) AS min_phase_date
    FROM min_dates
    GROUP BY min_dates.project_id
),

project_component_work_types AS (
    SELECT
        mpc.project_id,
        string_agg(DISTINCT mwt.name, ', '::text ORDER BY mwt.name) AS component_work_type_names
    FROM moped_proj_components mpc
    LEFT JOIN moped_proj_component_work_types mpcwt ON mpc.project_component_id = mpcwt.project_component_id
    LEFT JOIN moped_work_types mwt ON mpcwt.work_type_id = mwt.id
    WHERE true AND mpc.is_deleted = false AND mpcwt.is_deleted = false
    GROUP BY mpc.project_id
)

SELECT
    mp.project_id,
    mp.project_name_full,
    mp.project_name,
    mp.project_name_secondary,
    mp.project_description,
    mp.ecapris_subproject_id,
    mp.project_website,
    mp.date_added,
    mp.is_deleted,
    mp.updated_at,
    current_phase.phase_name AS current_phase,
    current_phase.phase_key AS current_phase_key,
    current_phase.phase_name_simple AS current_phase_simple,
    ppll.project_team_members,
    me.entity_name AS project_sponsor,
    mel.entity_name AS project_lead,
    mpps.name AS public_process_status,
    mp.interim_project_id,
    mp.parent_project_id,
    mp.knack_project_id,
    'https://mobility.austin.gov/moped/projects/'::text || mp.project_id::text AS project_url,
    'https://mobility.austin.gov/moped/projects/'::text || mp.parent_project_id::text AS parent_project_url,
    proj_status_update.project_note AS project_status_update,
    proj_status_update.date_created AS project_status_update_date_created,
    proj_status_update.author AS project_status_update_author,
    work_activities.workgroup_contractors,
    work_activities.contract_numbers,
    work_activities.task_order_names,
    work_activities.task_order_names_short,
    work_activities.task_orders,
    (
        SELECT moped_project.project_name_full
        FROM moped_project
        WHERE moped_project.project_id = mp.parent_project_id
    ) AS parent_project_name,
    cpl.children_project_ids,
    string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partners,
    (
        SELECT json_agg(json_build_object('signal_id', feature_signals.signal_id, 'knack_id', feature_signals.knack_id, 'location_name', feature_signals.location_name, 'signal_type', feature_signals.signal_type, 'id', feature_signals.id)) AS json_agg
        FROM moped_proj_components components
        LEFT JOIN feature_signals ON components.project_component_id = feature_signals.component_id
        WHERE true AND components.is_deleted = false AND components.project_id = mp.project_id AND feature_signals.signal_id IS NOT null AND feature_signals.is_deleted = false
    ) AS project_feature,
    fsl.funding_source_name,
    fsl.funding_program_names,
    fsl.funding_source_and_program_names,
    (
        SELECT min(phases.phase_start) AS min
        FROM moped_proj_phases phases
        WHERE true AND phases.project_id = mp.project_id AND phases.phase_id = 9 AND phases.is_deleted = false
    ) AS construction_start_date,
    mcpd.min_phase_date AS substantial_completion_date,
    CASE
        WHEN mcpd.min_phase_date IS NOT null THEN null::timestamp with time zone
        ELSE mepd.min_phase_date
    END AS substantial_completion_date_estimated,
    (
        SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
        FROM moped_proj_personnel mpp
        JOIN moped_users users ON mpp.user_id = users.user_id
        JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
        WHERE 1 = 1 AND mpr.project_role_name = 'Inspector'::text AND mpp.is_deleted = false AND mppr.is_deleted = false AND mpp.project_id = mp.project_id
        GROUP BY mpp.project_id
    ) AS project_inspector,
    (
        SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
        FROM moped_proj_personnel mpp
        JOIN moped_users users ON mpp.user_id = users.user_id
        JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
        WHERE 1 = 1 AND mpr.project_role_name = 'Designer'::text AND mpp.is_deleted = false AND mppr.is_deleted = false AND mpp.project_id = mp.project_id
        GROUP BY mpp.project_id
    ) AS project_designer,
    (
        SELECT string_agg(tags.name, ', '::text) AS string_agg
        FROM moped_proj_tags ptags
        JOIN moped_tags tags ON ptags.tag_id = tags.id
        WHERE 1 = 1 AND ptags.is_deleted = false AND ptags.project_id = mp.project_id
        GROUP BY ptags.project_id
    ) AS project_tags,
    concat(added_by_user.first_name, ' ', added_by_user.last_name) AS added_by,
    mpcs.components,
    districts.project_council_districts,
    districts.project_and_child_project_council_districts,
    pcwt.component_work_type_names
FROM moped_project mp
LEFT JOIN project_person_list_lookup ppll ON mp.project_id = ppll.project_id
LEFT JOIN funding_sources_lookup fsl ON mp.project_id = fsl.project_id
LEFT JOIN moped_entity me ON mp.project_sponsor = me.entity_id
LEFT JOIN moped_entity mel ON mp.project_lead_id = mel.entity_id
LEFT JOIN moped_proj_partners mpp2 ON mp.project_id = mpp2.project_id AND mpp2.is_deleted = false
LEFT JOIN moped_entity me2 ON mpp2.entity_id = me2.entity_id
LEFT JOIN work_activities ON mp.project_id = work_activities.project_id
LEFT JOIN moped_users added_by_user ON mp.added_by = added_by_user.user_id
LEFT JOIN current_phase_view current_phase ON mp.project_id = current_phase.project_id
LEFT JOIN moped_public_process_statuses mpps ON mp.public_process_status_id = mpps.id
LEFT JOIN child_project_lookup cpl ON mp.project_id = cpl.parent_id
LEFT JOIN moped_proj_components_subtypes mpcs ON mp.project_id = mpcs.project_id
LEFT JOIN project_district_association districts ON mp.project_id = districts.project_id
LEFT JOIN min_confirmed_phase_dates mcpd ON mp.project_id = mcpd.project_id
LEFT JOIN min_estimated_phase_dates mepd ON mp.project_id = mepd.project_id
LEFT JOIN project_component_work_types pcwt ON mp.project_id = pcwt.project_id
LEFT JOIN LATERAL (SELECT
    combined_project_notes_view.project_note,
    combined_project_notes_view.created_at AS date_created,
    combined_project_notes_view.author
FROM combined_project_notes_view
WHERE (combined_project_notes_view.project_id = mp.project_id OR mp.should_sync_ecapris_statuses = true AND mp.ecapris_subproject_id IS NOT null AND combined_project_notes_view.ecapris_subproject_id = mp.ecapris_subproject_id) AND combined_project_notes_view.is_status_update = true
ORDER BY combined_project_notes_view.created_at DESC
LIMIT 1) proj_status_update ON true
WHERE mp.is_deleted = false
GROUP BY mp.project_id, mp.project_name, mp.project_description, ppll.project_team_members, mp.ecapris_subproject_id, mp.date_added, mp.is_deleted, me.entity_name, mel.entity_name, mp.updated_at, mp.interim_project_id, mp.parent_project_id, mp.knack_project_id, current_phase.phase_name, current_phase.phase_key, current_phase.phase_name_simple, mpcs.components, fsl.funding_source_name, fsl.funding_program_names, fsl.funding_source_and_program_names, added_by_user.first_name, added_by_user.last_name, mpps.name, cpl.children_project_ids, proj_status_update.project_note, proj_status_update.date_created, proj_status_update.author, work_activities.workgroup_contractors, work_activities.contract_numbers, work_activities.task_order_names, work_activities.task_order_names_short, work_activities.task_orders, districts.project_council_districts, districts.project_and_child_project_council_districts, mepd.min_phase_date, mcpd.min_phase_date, pcwt.component_work_type_names;
