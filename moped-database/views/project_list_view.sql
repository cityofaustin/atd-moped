-- Most recent migration: moped-database/migrations/default/1777661669380_speed_up_project_list_view/up.sql

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
        cfv.project_id,
        string_agg(DISTINCT cfv.source_name, ', '::text ORDER BY cfv.source_name) AS funding_source_name,
        string_agg(DISTINCT cfv.program_name, ', '::text ORDER BY cfv.program_name) AS funding_program_names,
        string_agg(
            DISTINCT
            CASE
                WHEN cfv.source_name IS NOT null AND cfv.program_name IS NOT null THEN concat(cfv.source_name, ' - ', cfv.program_name)
                WHEN cfv.source_name IS NOT null THEN cfv.source_name
                WHEN cfv.program_name IS NOT null THEN cfv.program_name
                ELSE null::text
            END, ', '::text ORDER BY (
                CASE
                    WHEN cfv.source_name IS NOT null AND cfv.program_name IS NOT null THEN concat(cfv.source_name, ' - ', cfv.program_name)
                    WHEN cfv.source_name IS NOT null THEN cfv.source_name
                    WHEN cfv.program_name IS NOT null THEN cfv.program_name
                    ELSE null::text
                END
            )
        ) AS funding_source_and_program_names
    FROM combined_project_funding_view cfv
    JOIN moped_project ON cfv.project_id = moped_project.project_id
    WHERE cfv.is_synced_from_ecapris = false OR moped_project.should_sync_ecapris_funding = true AND moped_project.ecapris_subproject_id IS NOT null AND cfv.is_synced_from_ecapris = true
    GROUP BY cfv.project_id
),

child_project_lookup AS (
    SELECT
        jsonb_agg(children.project_id) AS children_project_ids,
        children.parent_project_id AS parent_id
    FROM moped_project children
    WHERE children.is_deleted = false AND children.parent_project_id IS NOT null
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
    WHERE mpwa.is_deleted = false
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
            mpc.project_id,
            fcd.council_district_id
        FROM moped_proj_components mpc
        JOIN features f ON mpc.project_component_id = f.component_id
        JOIN features_council_districts fcd ON f.id = fcd.feature_id
        WHERE f.is_deleted = false AND mpc.is_deleted = false
    ),

parent_child_project_map AS (
        SELECT
            parent_projects.project_id,
            parent_projects.project_id AS self_and_children_project_id
        FROM moped_project parent_projects
        UNION ALL
        SELECT
            parent_projects.project_id,
            child_projects.project_id AS self_and_children_project_id
        FROM moped_project parent_projects
        JOIN moped_project child_projects ON parent_projects.project_id = child_projects.parent_project_id
        WHERE child_projects.is_deleted = false
    )

    SELECT
        projects.project_id,
        jsonb_agg(DISTINCT project_districts.council_district_id) FILTER (WHERE project_districts.council_district_id IS NOT null) AS project_council_districts,
        jsonb_agg(DISTINCT project_and_children_districts.council_district_id) FILTER (WHERE project_and_children_districts.council_district_id IS NOT null) AS project_and_child_project_council_districts,
        string_agg(DISTINCT project_districts.council_district_id::text, ', '::text ORDER BY (project_districts.council_district_id::text)) AS project_council_districts_str,
        string_agg(DISTINCT project_and_children_districts.council_district_id::text, ', '::text ORDER BY (project_and_children_districts.council_district_id::text)) AS project_and_child_project_council_districts_str
    FROM moped_project projects
    LEFT JOIN project_council_district_map project_districts ON projects.project_id = project_districts.project_id
    LEFT JOIN parent_child_project_map project_family ON projects.project_id = project_family.project_id
    LEFT JOIN project_council_district_map project_and_children_districts ON project_family.self_and_children_project_id = project_and_children_districts.project_id
    GROUP BY projects.project_id
),

phase_date_inputs AS (
    SELECT
        phases.project_id,
        min(phases.phase_start) FILTER (WHERE phases.phase_start IS NOT null AND phases.is_phase_start_confirmed = true) AS min_confirmed_phase_start,
        min(phases.phase_end) FILTER (WHERE phases.phase_end IS NOT null AND phases.is_phase_end_confirmed = true) AS min_confirmed_phase_end,
        min(phases.phase_start) FILTER (WHERE phases.phase_start IS NOT null AND phases.is_phase_start_confirmed = false) AS min_estimated_phase_start,
        min(phases.phase_end) FILTER (WHERE phases.phase_end IS NOT null AND phases.is_phase_end_confirmed = false) AS min_estimated_phase_end
    FROM moped_proj_phases phases
    JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
    WHERE phases.is_deleted = false AND moped_phases.phase_name_simple = 'Complete'::text
    GROUP BY phases.project_id
),

phase_dates AS (
    SELECT
        pdi.project_id,
        CASE
            WHEN pdi.min_confirmed_phase_start IS null THEN pdi.min_confirmed_phase_end
            WHEN pdi.min_confirmed_phase_end IS null THEN pdi.min_confirmed_phase_start
            ELSE least(pdi.min_confirmed_phase_start, pdi.min_confirmed_phase_end)
        END AS min_confirmed_phase_date,
        CASE
            WHEN pdi.min_estimated_phase_start IS null THEN pdi.min_estimated_phase_end
            WHEN pdi.min_estimated_phase_end IS null THEN pdi.min_estimated_phase_start
            ELSE least(pdi.min_estimated_phase_start, pdi.min_estimated_phase_end)
        END AS min_estimated_phase_date
    FROM phase_date_inputs pdi
),

project_component_work_types AS (
    SELECT
        mpc.project_id,
        string_agg(DISTINCT mwt.name, ', '::text ORDER BY mwt.name) AS component_work_type_names
    FROM moped_proj_components mpc
    LEFT JOIN moped_proj_component_work_types mpcwt ON mpc.project_component_id = mpcwt.project_component_id
    LEFT JOIN moped_work_types mwt ON mpcwt.work_type_id = mwt.id
    WHERE mpc.is_deleted = false AND mpcwt.is_deleted = false
    GROUP BY mpc.project_id
),

project_partners_lookup AS (
    SELECT
        mpp2.project_id,
        string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partners
    FROM moped_proj_partners mpp2
    LEFT JOIN moped_entity me2 ON mpp2.entity_id = me2.entity_id
    WHERE mpp2.is_deleted = false
    GROUP BY mpp2.project_id
),

project_feature_lookup AS (
    SELECT
        components.project_id,
        json_agg(json_build_object('signal_id', feature_signals.signal_id, 'knack_id', feature_signals.knack_id, 'location_name', feature_signals.location_name, 'signal_type', feature_signals.signal_type, 'id', feature_signals.id)) AS project_feature
    FROM moped_proj_components components
    LEFT JOIN feature_signals ON components.project_component_id = feature_signals.component_id
    WHERE components.is_deleted = false AND feature_signals.signal_id IS NOT null AND feature_signals.is_deleted = false
    GROUP BY components.project_id
),

construction_start_dates AS (
    SELECT
        phases.project_id,
        min(phases.phase_start) AS construction_start_date
    FROM moped_proj_phases phases
    WHERE phases.phase_id = 9 AND phases.is_deleted = false
    GROUP BY phases.project_id
),

project_roles_lookup AS (
    SELECT
        mpp.project_id,
        string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) FILTER (WHERE mpr.project_role_name = 'Inspector'::text) AS project_inspector,
        string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) FILTER (WHERE mpr.project_role_name = 'Designer'::text) AS project_designer
    FROM moped_proj_personnel mpp
    JOIN moped_users users ON mpp.user_id = users.user_id
    JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
    JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
    WHERE mpp.is_deleted = false AND mppr.is_deleted = false AND (mpr.project_role_name = any(ARRAY['Inspector'::text, 'Designer'::text]))
    GROUP BY mpp.project_id
),

project_tags_lookup AS (
    SELECT
        ptags.project_id,
        string_agg(tags.name, ', '::text) AS project_tags
    FROM moped_proj_tags ptags
    JOIN moped_tags tags ON ptags.tag_id = tags.id
    WHERE ptags.is_deleted = false
    GROUP BY ptags.project_id
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
    parent_project.project_name_full AS parent_project_name,
    cpl.children_project_ids,
    project_partners_lookup.project_partners,
    project_feature_lookup.project_feature,
    fsl.funding_source_name,
    fsl.funding_program_names,
    fsl.funding_source_and_program_names,
    construction_start_dates.construction_start_date,
    phase_dates.min_confirmed_phase_date AS substantial_completion_date,
    CASE
        WHEN phase_dates.min_confirmed_phase_date IS NOT null THEN null::timestamp with time zone
        ELSE phase_dates.min_estimated_phase_date
    END AS substantial_completion_date_estimated,
    project_roles_lookup.project_inspector,
    project_roles_lookup.project_designer,
    project_tags_lookup.project_tags,
    concat(added_by_user.first_name, ' ', added_by_user.last_name) AS added_by,
    mpcs.components,
    districts.project_council_districts,
    districts.project_and_child_project_council_districts,
    districts.project_council_districts_str,
    districts.project_and_child_project_council_districts_str,
    pcwt.component_work_type_names
FROM moped_project mp
LEFT JOIN project_person_list_lookup ppll ON mp.project_id = ppll.project_id
LEFT JOIN funding_sources_lookup fsl ON mp.project_id = fsl.project_id
LEFT JOIN moped_entity me ON mp.project_sponsor = me.entity_id
LEFT JOIN moped_entity mel ON mp.project_lead_id = mel.entity_id
LEFT JOIN project_partners_lookup ON mp.project_id = project_partners_lookup.project_id
LEFT JOIN work_activities ON mp.project_id = work_activities.project_id
LEFT JOIN moped_users added_by_user ON mp.added_by = added_by_user.user_id
LEFT JOIN current_phase_view current_phase ON mp.project_id = current_phase.project_id
LEFT JOIN moped_public_process_statuses mpps ON mp.public_process_status_id = mpps.id
LEFT JOIN child_project_lookup cpl ON mp.project_id = cpl.parent_id
LEFT JOIN moped_proj_components_subtypes mpcs ON mp.project_id = mpcs.project_id
LEFT JOIN project_district_association districts ON mp.project_id = districts.project_id
LEFT JOIN phase_dates ON mp.project_id = phase_dates.project_id
LEFT JOIN project_component_work_types pcwt ON mp.project_id = pcwt.project_id
LEFT JOIN project_feature_lookup ON mp.project_id = project_feature_lookup.project_id
LEFT JOIN construction_start_dates ON mp.project_id = construction_start_dates.project_id
LEFT JOIN project_roles_lookup ON mp.project_id = project_roles_lookup.project_id
LEFT JOIN project_tags_lookup ON mp.project_id = project_tags_lookup.project_id
LEFT JOIN moped_project parent_project ON mp.parent_project_id = parent_project.project_id
LEFT JOIN LATERAL (SELECT
    combined_project_notes_view.project_note,
    combined_project_notes_view.created_at AS date_created,
    combined_project_notes_view.author
FROM combined_project_notes_view
WHERE (combined_project_notes_view.project_id = mp.project_id OR mp.should_sync_ecapris_statuses = true AND mp.ecapris_subproject_id IS NOT null AND combined_project_notes_view.ecapris_subproject_id = mp.ecapris_subproject_id) AND combined_project_notes_view.is_status_update = true
ORDER BY combined_project_notes_view.created_at DESC
LIMIT 1) proj_status_update ON true
WHERE mp.is_deleted = false;
