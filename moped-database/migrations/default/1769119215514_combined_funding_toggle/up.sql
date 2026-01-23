--
-- ADD NEW COLUMN TO TOGGLE USING ECAPRIS AMOUNTS IN COMBINED FUNDING VIEW
--
ALTER TABLE moped_proj_funding ADD COLUMN should_use_ecapris_amount BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN moped_proj_funding.should_use_ecapris_amount IS 'Indicates whether the funding record should use values from eCapris in combined view';

-- Drop and replace combined view and dependencies
DROP VIEW IF EXISTS exploded_component_arcgis_online_view;
DROP VIEW IF EXISTS component_arcgis_online_view;
DROP VIEW IF EXISTS project_list_view;
DROP VIEW IF EXISTS combined_project_funding_view;

CREATE OR REPLACE VIEW combined_project_funding_view AS SELECT
    'moped_'::text || moped_proj_funding.proj_funding_id AS id,
    moped_proj_funding.proj_funding_id AS original_id,
    moped_proj_funding.created_at,
    moped_proj_funding.updated_at,
    moped_proj_funding.project_id,
    moped_proj_funding.fdu,
    moped_proj_funding.unit_long_name,
    CASE 
        WHEN moped_proj_funding.should_use_ecapris_amount = true AND ecapris_subproject_funding.fao_id IS NOT NULL 
        THEN ecapris_subproject_funding.app 
        ELSE moped_proj_funding.funding_amount 
    END AS amount,
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
    moped_proj_funding.is_manual,
    moped_proj_funding.should_use_ecapris_amount
FROM moped_proj_funding
LEFT JOIN moped_fund_status ON moped_proj_funding.funding_status_id = moped_fund_status.funding_status_id
LEFT JOIN moped_fund_sources ON moped_proj_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
LEFT JOIN ecapris_subproject_funding ON moped_proj_funding.ecapris_funding_id = ecapris_subproject_funding.fao_id
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
    false AS is_manual,
    true AS should_use_ecapris_amount
FROM ecapris_subproject_funding
INNER JOIN moped_project ON ecapris_subproject_funding.ecapris_subproject_id = moped_project.ecapris_subproject_id
WHERE NOT (EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu AND moped_proj_funding.project_id = moped_project.project_id AND moped_proj_funding.is_deleted = false
    ));
    
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

CREATE OR REPLACE VIEW component_arcgis_online_view AS WITH work_types AS (
    SELECT
        mpcwt.project_component_id,
        string_agg(mwt.name, ', '::text) AS work_types
    FROM moped_proj_component_work_types mpcwt
    LEFT JOIN moped_work_types mwt ON mpcwt.work_type_id = mwt.id
    WHERE mpcwt.is_deleted = false
    GROUP BY mpcwt.project_component_id
),

council_districts AS (
    SELECT
        features.component_id AS project_component_id,
        string_agg(DISTINCT features_council_districts.council_district_id::text, ', '::text) AS council_districts,
        string_agg(DISTINCT lpad(features_council_districts.council_district_id::text, 2, '0'::text), ', '::text) AS council_districts_searchable
    FROM features_council_districts
    LEFT JOIN features ON features_council_districts.feature_id = features.id
    WHERE features.is_deleted = false
    GROUP BY features.component_id
),

comp_geography AS (
    SELECT
        feature_union.component_id AS project_component_id,
        string_agg(DISTINCT feature_union.id::text, ', '::text) AS feature_ids,
        st_asgeojson(st_multi(st_union(array_agg(feature_union.geography))))::json AS geometry,
        st_asgeojson(st_multi(st_union(array_agg(feature_union.line_geography))))::json AS line_geometry,
        string_agg(DISTINCT feature_union.signal_id::text, ', '::text) AS signal_ids,
        sum(feature_union.length_feet) AS length_feet_total
    FROM (
        SELECT
            feature_signals.id,
            feature_signals.component_id,
            feature_signals.geography::geometry AS geography,
            st_exteriorring(st_buffer(feature_signals.geography, 7::double precision)::geometry) AS line_geography,
            feature_signals.signal_id,
            null::integer AS length_feet
        FROM feature_signals
        WHERE feature_signals.is_deleted = false
        UNION ALL
        SELECT
            feature_street_segments.id,
            feature_street_segments.component_id,
            feature_street_segments.geography::geometry AS geography,
            feature_street_segments.geography::geometry AS line_geography,
            null::integer AS signal_id,
            feature_street_segments.length_feet
        FROM feature_street_segments
        WHERE feature_street_segments.is_deleted = false
        UNION ALL
        SELECT
            feature_intersections.id,
            feature_intersections.component_id,
            feature_intersections.geography::geometry AS geography,
            st_exteriorring(st_buffer(feature_intersections.geography, 7::double precision)::geometry) AS line_geography,
            null::integer AS signal_id,
            null::integer AS length_feet
        FROM feature_intersections
        WHERE feature_intersections.is_deleted = false
        UNION ALL
        SELECT
            feature_drawn_points.id,
            feature_drawn_points.component_id,
            feature_drawn_points.geography::geometry AS geography,
            st_exteriorring(st_buffer(feature_drawn_points.geography, 7::double precision)::geometry) AS line_geography,
            null::integer AS signal_id,
            null::integer AS length_feet
        FROM feature_drawn_points
        WHERE feature_drawn_points.is_deleted = false
        UNION ALL
        SELECT
            feature_drawn_lines.id,
            feature_drawn_lines.component_id,
            feature_drawn_lines.geography::geometry AS geography,
            feature_drawn_lines.geography::geometry AS line_geography,
            null::integer AS signal_id,
            feature_drawn_lines.length_feet
        FROM feature_drawn_lines
        WHERE feature_drawn_lines.is_deleted = false
        UNION ALL
        SELECT
            feature_school_beacons.id,
            feature_school_beacons.component_id,
            feature_school_beacons.geography::geometry AS geography,
            st_exteriorring(st_buffer(feature_school_beacons.geography, 7::double precision)::geometry) AS line_geography,
            null::integer AS signal_id,
            null::integer AS length_feet
        FROM feature_school_beacons
        WHERE feature_school_beacons.is_deleted = false
    ) feature_union
    GROUP BY feature_union.component_id
),

subcomponents AS (
    SELECT
        mpcs.project_component_id,
        string_agg(ms.subcomponent_name, ', '::text) AS subcomponents
    FROM moped_proj_components_subcomponents mpcs
    LEFT JOIN moped_subcomponents ms ON mpcs.subcomponent_id = ms.subcomponent_id
    WHERE mpcs.is_deleted = false
    GROUP BY mpcs.project_component_id
),

component_tags AS (
    SELECT
        mpct.project_component_id,
        string_agg(mct.full_name, ', '::text) AS component_tags
    FROM moped_proj_component_tags mpct
    LEFT JOIN moped_component_tags mct ON mpct.component_tag_id = mct.id
    WHERE mpct.is_deleted = false
    GROUP BY mpct.project_component_id
),

related_projects AS (
    SELECT
        pmp.project_id,
        concat_ws(', '::text, pmp.project_id, string_agg(cmp.project_id::text, ', '::text)) AS related_project_ids_with_self,
        concat_ws(', '::text, lpad(pmp.project_id::text, 5, '0'::text), string_agg(lpad(cmp.project_id::text, 5, '0'::text), ', '::text)) AS related_project_ids_searchable_with_self
    FROM moped_project pmp
    LEFT JOIN moped_project cmp ON pmp.project_id = cmp.parent_project_id
    WHERE cmp.is_deleted = false
    GROUP BY pmp.project_id
),

latest_public_meeting_date AS (
    SELECT
        mpm.project_id,
        coalesce(max(mpm.date_actual), max(mpm.date_estimate)) AS latest
    FROM moped_proj_milestones mpm
    WHERE mpm.milestone_id = 65 AND mpm.is_deleted = false
    GROUP BY mpm.project_id
),

earliest_active_or_construction_phase_date AS (
    SELECT
        mpp.project_id,
        min(mpp.phase_start) AS earliest
    FROM moped_proj_phases mpp
    LEFT JOIN moped_phases mp ON mpp.phase_id = mp.phase_id
    WHERE (mp.phase_name_simple = any(ARRAY['Active'::text, 'Construction'::text])) AND mpp.is_deleted = false
    GROUP BY mpp.project_id
)

SELECT
    mpc.project_id,
    mpc.project_component_id,
    comp_geography.feature_ids,
    mpc.component_id,
    comp_geography.geometry,
    comp_geography.line_geometry,
    comp_geography.signal_ids,
    council_districts.council_districts,
    council_districts.council_districts_searchable,
    NOT coalesce(council_districts.council_districts IS null OR council_districts.council_districts = ''::text, false) AS is_within_city_limits,
    comp_geography.length_feet_total,
    round(comp_geography.length_feet_total::numeric / 5280::numeric, 2) AS length_miles_total,
    mc.component_name,
    mc.component_subtype,
    mc.component_name_full,
    CASE
        WHEN mc.line_representation = true THEN 'Line'::text
        ELSE 'Point'::text
    END AS geometry_type,
    CASE
        WHEN comp_geography.geometry IS null THEN false
        ELSE true
    END AS is_mapped,
    subcomponents.subcomponents AS component_subcomponents,
    work_types.work_types AS component_work_types,
    component_tags.component_tags,
    mpc.description AS component_description,
    mpc.interim_project_component_id,
    CASE
        WHEN mpc.phase_id IS null THEN plv.substantial_completion_date
        WHEN mpc.phase_id IS NOT null AND mpc.completion_date IS null THEN null::timestamp with time zone
        ELSE mpc.completion_date
    END AS substantial_completion_date,
    plv.substantial_completion_date_estimated,
    mpc.srts_id,
    mpc.location_description AS component_location_description,
    plv.project_name,
    plv.project_name_secondary,
    plv.project_name_full,
    plv.project_description,
    plv.ecapris_subproject_id,
    plv.project_website,
    plv.updated_at AS project_updated_at,
    plv.date_added AS project_created_at,
    mpc.phase_id AS component_phase_id,
    mph.phase_name AS component_phase_name,
    mph.phase_name_simple AS component_phase_name_simple,
    current_phase.phase_id AS project_phase_id,
    current_phase.phase_name AS project_phase_name,
    current_phase.phase_name_simple AS project_phase_name_simple,
    coalesce(mph.phase_name, current_phase.phase_name) AS current_phase_name,
    coalesce(mph.phase_name_simple, current_phase.phase_name_simple) AS current_phase_name_simple,
    plv.project_team_members,
    plv.project_sponsor,
    plv.project_lead,
    plv.public_process_status,
    plv.interim_project_id,
    plv.project_partners,
    plv.task_order_names,
    plv.funding_source_and_program_names AS funding_sources,
    plv.project_status_update,
    plv.project_status_update_date_created,
    to_char(timezone('US/Central'::text, plv.construction_start_date), 'YYYY-MM-DD'::text) AS construction_start_date,
    plv.project_inspector,
    plv.project_designer,
    plv.project_tags,
    plv.workgroup_contractors,
    plv.contract_numbers,
    plv.parent_project_id,
    plv.parent_project_name,
    plv.parent_project_url,
    plv.parent_project_name AS parent_project_name_full,
    rp.related_project_ids_with_self AS related_project_ids,
    rp.related_project_ids_searchable_with_self AS related_project_ids_searchable,
    plv.knack_project_id AS knack_data_tracker_project_record_id,
    plv.project_url,
    (plv.project_url || '?tab=map&project_component_id='::text) || mpc.project_component_id::text AS component_url,
    get_project_development_status(lpmd.latest::timestamp with time zone, eaocpd.earliest, coalesce(mpc.completion_date, plv.substantial_completion_date), plv.substantial_completion_date_estimated, coalesce(mph.phase_name_simple, current_phase.phase_name_simple)) AS project_development_status,
    project_development_status_date.result AS project_development_status_date,
    to_char(project_development_status_date.result, 'YYYY'::text)::integer AS project_development_status_date_calendar_year,
    to_char(project_development_status_date.result, 'FMMonth YYYY'::text) AS project_development_status_date_calendar_year_month,
    to_char(project_development_status_date.result, 'YYYY-MM'::text) AS project_development_status_date_calendar_year_month_numeric,
    date_part('quarter'::text, project_development_status_date.result)::text AS project_development_status_date_calendar_year_quarter,
    CASE
        WHEN date_part('quarter'::text, project_development_status_date.result) = 4::double precision THEN (to_char(project_development_status_date.result, 'YYYY'::text)::integer + 1)::text
        ELSE to_char(project_development_status_date.result, 'YYYY'::text)
    END AS project_development_status_date_fiscal_year,
    CASE
        WHEN date_part('quarter'::text, project_development_status_date.result) = 4::double precision THEN 1::double precision
        ELSE date_part('quarter'::text, project_development_status_date.result) + 1::double precision
    END::text AS project_development_status_date_fiscal_year_quarter,
    plv.added_by AS project_added_by
FROM moped_proj_components mpc
LEFT JOIN comp_geography ON mpc.project_component_id = comp_geography.project_component_id
LEFT JOIN council_districts ON mpc.project_component_id = council_districts.project_component_id
LEFT JOIN subcomponents ON mpc.project_component_id = subcomponents.project_component_id
LEFT JOIN work_types ON mpc.project_component_id = work_types.project_component_id
LEFT JOIN component_tags ON mpc.project_component_id = component_tags.project_component_id
LEFT JOIN project_list_view plv ON mpc.project_id = plv.project_id
LEFT JOIN current_phase_view current_phase ON mpc.project_id = current_phase.project_id
LEFT JOIN moped_phases mph ON mpc.phase_id = mph.phase_id
LEFT JOIN moped_components mc ON mpc.component_id = mc.component_id
LEFT JOIN related_projects rp ON mpc.project_id = rp.project_id
LEFT JOIN latest_public_meeting_date lpmd ON mpc.project_id = lpmd.project_id
LEFT JOIN earliest_active_or_construction_phase_date eaocpd ON mpc.project_id = eaocpd.project_id
LEFT JOIN LATERAL (SELECT timezone('US/Central'::text, get_project_development_status_date(lpmd.latest::timestamp with time zone, eaocpd.earliest, coalesce(mpc.completion_date, plv.substantial_completion_date), plv.substantial_completion_date_estimated, coalesce(mph.phase_name_simple, current_phase.phase_name_simple))) AS result) project_development_status_date ON true
WHERE mpc.is_deleted = false AND plv.is_deleted = false;

CREATE OR REPLACE VIEW exploded_component_arcgis_online_view AS SELECT
    component_arcgis_online_view.project_id,
    component_arcgis_online_view.project_component_id,
    st_geometrytype(dump.geom) AS geometry_type,
    dump.path[1] AS point_index,
    component_arcgis_online_view.geometry AS original_geometry,
    st_asgeojson(dump.geom) AS exploded_geometry,
    component_arcgis_online_view.project_updated_at
FROM component_arcgis_online_view,
    LATERAL st_dump(st_geomfromgeojson(component_arcgis_online_view.geometry)) dump (path, geom)
WHERE st_geometrytype(st_geomfromgeojson(component_arcgis_online_view.geometry)) = 'ST_MultiPoint'::text;

--
-- SWTICH LEGACY FUNDING RECORDS TO USE ECAPRIS AMOUNTS FOR SELECT FDUS
--
-- We are only updating a subset of legacy records matched on the following list of FDUs
-- sourced from Nathan W's Power BI funding dashboard that was reviewed by leads.
-- These FDUs are not split between Moped projects and should be kept up to date with eCAPRIS
-- by using the should_use_ecapris_amount switch to show latest eCAPRIS appropriated amount
-- in the combined funding DB view (the update made in this migration).
WITH
	funding_to_link_todos AS (
		SELECT
			moped_proj_funding.proj_funding_id,
			ecapris_subproject_funding.fao_id,
			ecapris_subproject_funding.ecapris_subproject_id
		FROM
			moped_proj_funding
			LEFT JOIN moped_project ON moped_project.project_id = moped_proj_funding.project_id
			INNER JOIN ecapris_subproject_funding ON ecapris_subproject_funding.fdu = moped_proj_funding.fdu
		WHERE
			moped_proj_funding.is_deleted = FALSE
			AND moped_project.is_deleted = FALSE
			AND moped_proj_funding.is_legacy_funding_record = TRUE
			AND moped_proj_funding.fdu IN (
				'4730 2507 I102',
				'4730 2507 M100',
				'4730 2507 M102',
				'4730 2507 M103',
				'4730 2507 M110',
				'4730 2507 M113',
				'4730 2507 M119',
				'4730 2507 M120',
				'4730 2507 M121',
				'4730 2507 M130',
				'8112 2507 A008',
				'8112 2507 A016',
				'8112 2507 A017',
				'8112 2507 A020',
				'8112 2507 A120',
				'8112 2507 A122',
				'8112 2507 A381',
				'8112 6207 A316',
				'8112 6207 A857',
				'8112 6207 A859',
				'8119 2507 C043',
				'8119 2507 C045',
				'8119 2507 C047',
				'8119 2507 C049',
				'8119 2507 C065',
				'8119 2507 C066',
				'8119 2507 C069',
				'8119 2507 C070',
				'8119 2507 C071',
				'8119 2507 C074',
				'8119 2507 C078',
				'8119 2507 C089',
				'8119 2507 C103',
				'8119 2507 C104',
				'8119 2507 C105',
				'8119 2507 C107',
				'8119 2507 C110',
				'8119 2507 C114',
				'8119 2507 C115',
				'8119 2507 C116',
				'8119 2507 C123',
				'8119 2507 C128',
				'8119 2507 C183',
				'8119 2507 C184',
				'8119 2507 C189',
				'8119 2507 C190',
				'8119 2507 C191',
				'8119 2507 C196',
				'8119 2507 C202',
				'8119 2507 C205',
				'8119 2507 C232',
				'8119 2507 L015',
				'8119 2507 L022',
				'8119 2507 L023',
				'8119 2507 L026',
				'8119 2507 L028',
				'8119 2507 L031',
				'8119 2507 L032',
				'8119 2507 L033',
				'8119 2507 L034',
				'8119 2507 L035',
				'8119 2507 L036',
				'8119 2507 L037',
				'8119 2507 L041',
				'8119 2507 L043',
				'8119 2507 L044',
				'8119 2507 L045',
				'8119 2507 L046',
				'8119 2507 L047',
				'8119 2507 L048',
				'8119 2507 L051',
				'8119 2507 L054',
				'8119 2507 L058',
				'8119 2507 L059',
				'8119 2507 L060',
				'8119 2507 L061',
				'8119 2507 L062',
				'8119 2507 L063',
				'8119 2507 L064',
				'8119 2507 L065',
				'8119 2507 L066',
				'8119 2507 L067',
				'8119 2507 L068',
				'8119 2507 L069',
				'8119 2507 L070',
				'8119 2507 L073',
				'8119 2507 L074',
				'8119 2507 L075',
				'8119 2507 L078',
				'8119 2507 L079',
				'8119 2507 L081',
				'8119 2507 L083',
				'8119 2507 L084',
				'8119 2507 L086',
				'8119 2507 L089',
				'8119 2507 L090',
				'8119 2507 L092',
				'8119 2507 L093',
				'8119 2507 L094',
				'8119 2507 L095',
				'8119 2507 L096',
				'8119 2507 L097',
				'8119 2507 L098',
				'8119 2507 L102',
				'8119 2507 L103',
				'8119 2507 L104',
				'8119 2507 L106',
				'8119 2507 L107',
				'8119 2507 L110',
				'8119 2507 L111',
				'8119 2507 L113',
				'8119 2507 L114',
				'8119 2507 L115',
				'8119 2507 L116',
				'8119 2507 L117',
				'8119 2507 L119',
				'8119 2507 L123',
				'8119 2507 L124',
				'8119 2507 L125',
				'8119 2507 L127',
				'8119 2507 L130',
				'8119 2507 L131',
				'8119 2507 L133',
				'8119 2507 L134',
				'8119 2507 L136',
				'8119 2507 L137',
				'8119 2507 L139',
				'8119 2507 L140',
				'8119 2507 L141',
				'8119 2507 L142',
				'8119 2507 L143',
				'8119 2507 L150',
				'8119 2507 L160',
				'8119 2507 L170',
				'8119 2507 L180',
				'8119 2507 L190',
				'8119 2507 L200',
				'8119 2507 L202',
				'8119 2507 L203',
				'8119 2507 L204',
				'8119 2507 L206',
				'8119 2507 R004',
				'8119 2507 R010',
				'8119 2507 R011',
				'8119 2507 R022',
				'8119 2507 R023',
				'8119 2507 RT10',
				'8119 2507 RT20',
				'8119 2507 RT40',
				'8119 2507 RT51',
				'8119 2507 RT52',
				'8119 2507 RT53',
				'8119 6207 L035',
				'8119 6207 L287',
				'8119 6207 L291',
				'8119 6207 L297',
				'8119 6207 L310',
				'8119 6207 L320',
				'8119 6207 L330',
				'8119 6207 LB05',
				'8119 6207 LB10',
				'8119 6207 LB19',
				'8119 6207 LB22',
				'8119 6207 LB24',
				'8119 6207 LB26',
				'8119 6207 LD10',
				'8119 6207 LF05',
				'8119 6207 LF15',
				'8119 6207 LF20',
				'8119 6207 LG04',
				'8119 6207 LG21',
				'8119 6207 LK22',
				'8119 6207 LK24',
				'8127 2507 B108',
				'8127 2507 B109',
				'8127 2507 B114',
				'8127 2507 B119',
				'8127 2507 B123',
				'8127 2507 B127',
				'8127 2507 B128',
				'8127 2507 B129',
				'8127 2507 B134',
				'8127 2507 B135',
				'8127 2507 B137',
				'8127 2507 B138',
				'8127 2507 B141',
				'8127 2507 B142',
				'8127 2507 B144',
				'8127 2507 B146',
				'8127 2507 B149',
				'8127 2507 B150',
				'8127 2507 B153',
				'8127 2507 B154',
				'8127 2507 B155',
				'8127 2507 B156',
				'8127 2507 B157',
				'8127 2507 B158',
				'8127 2507 B159',
				'8127 2507 B160',
				'8127 2507 B161',
				'8127 2507 B162',
				'8127 2507 B163',
				'8127 2507 B164',
				'8127 2507 B166',
				'8127 2507 B167',
				'8127 2507 B168',
				'8127 2507 B170',
				'8127 2507 B171',
				'8127 2507 B172',
				'8127 2507 B173',
				'8127 2507 B174',
				'8127 2507 B176',
				'8127 2507 B178',
				'8127 2507 B179',
				'8127 2507 B180',
				'8127 2507 B181',
				'8127 2507 B184',
				'8127 2507 B185',
				'8127 2507 B186',
				'8127 6207 B245',
				'8127 6207 B257',
				'8127 6207 B279',
				'8127 6207 B701',
				'820B 2507 4A05',
				'820B 2507 4A06',
				'820B 2507 4A07',
				'820B 2507 4A08',
				'820B 2507 4A09',
				'820B 2507 4A10',
				'820B 2507 4A11',
				'820B 2507 4A12',
				'820B 2507 4A13',
				'820B 2507 4A14',
				'820B 2507 4A16',
				'820B 2507 4A17',
				'820B 2507 4A18',
				'820B 2507 4S01',
				'820B 2507 4S02',
				'820B 2507 4S03',
				'820B 2507 4S05',
				'820B 2507 4S08',
				'820B 2507 D105',
				'820B 2507 D106',
				'820B 2507 D108',
				'820B 2507 D10A',
				'820B 2507 D110',
				'820B 2507 D111',
				'820B 2507 D114',
				'820B 2507 D115',
				'820B 2507 D117',
				'820B 2507 D118',
				'820B 2507 D119',
				'820B 2507 D125',
				'820B 2507 D128',
				'820B 2507 D129',
				'820B 2507 D132',
				'820B 2507 D134',
				'820B 2507 D135',
				'820B 2507 D139',
				'820B 2507 D140',
				'820B 2507 D141',
				'820B 2507 D142',
				'820B 2507 D144',
				'820B 2507 D145',
				'820B 2507 D150',
				'820B 2507 D152',
				'820B 2507 D153',
				'820B 2507 D155',
				'820B 2507 D158',
				'820B 2507 D159',
				'820B 2507 D160',
				'820B 2507 D163',
				'820B 2507 D164',
				'820B 2507 D168',
				'820B 2507 D170',
				'820B 2507 D171',
				'820B 2507 D172',
				'820B 2507 D173',
				'820B 2507 D175',
				'820B 2507 D176',
				'820B 2507 D177',
				'820B 2507 D178',
				'820B 2507 D181',
				'820B 2507 D182',
				'820B 2507 D183',
				'820B 2507 D184',
				'820B 2507 D187',
				'820B 2507 D188',
				'820B 2507 D189',
				'820B 2507 D190',
				'820B 2507 D191',
				'820B 2507 D192',
				'820B 2507 D193',
				'820B 2507 D194',
				'820B 2507 D195',
				'820B 2507 D196',
				'820B 2507 D197',
				'820B 2507 D199',
				'820B 2507 D201',
				'820B 2507 D202',
				'820B 2507 D204',
				'820B 2507 D313',
				'820B 2507 D315',
				'820B 2507 D318',
				'820B 2507 D321',
				'820B 2507 D322',
				'820B 2507 D323',
				'820B 2507 D324',
				'820B 2507 D325',
				'820B 2507 D351',
				'820B 2507 D352',
				'820B 2507 D353',
				'820B 2507 D354',
				'820B 2507 D356',
				'820B 2507 D357',
				'820B 2507 D363',
				'820B 2507 D368',
				'820B 2507 D376',
				'820B 2507 D381',
				'820B 2507 D382',
				'820B 2507 D383',
				'820B 2507 D384',
				'820B 2507 D391',
				'820B 2507 D403',
				'820B 2507 D404',
				'820B 2507 D408',
				'820B 2507 D410',
				'820B 2507 D412',
				'820B 2507 D414',
				'820B 2507 D454',
				'820B 2507 D455',
				'820B 2507 D456',
				'820B 2507 D458',
				'820B 2507 D459',
				'820B 2507 D460',
				'820B 2507 D461',
				'820B 2507 D463',
				'820B 2507 D464',
				'820B 2507 D465',
				'820B 2507 D466',
				'820B 2507 D467',
				'820B 2507 D468',
				'820B 2507 D469',
				'820B 2507 D470',
				'820B 2507 D472',
				'820B 2507 D476',
				'820B 2507 D477',
				'820B 2507 D480',
				'820B 2507 D500',
				'820B 2507 D502',
				'820B 2507 D508',
				'820B 2507 D509',
				'820B 2507 D510',
				'820B 2507 D512',
				'820B 2507 D513',
				'820B 2507 D514',
				'820B 2507 D517',
				'820B 2507 D518',
				'820B 2507 D519',
				'820B 2507 D520',
				'820B 2507 D521',
				'820B 2507 D522',
				'820B 2507 D523',
				'820B 2507 D526',
				'820B 2507 D527',
				'820B 2507 D528',
				'820B 2507 D531',
				'820B 2507 D536',
				'820B 2507 D538',
				'820B 2507 D539',
				'820B 2507 D540',
				'820B 2507 D541',
				'820B 2507 D542',
				'820B 2507 D545',
				'820B 2507 D548',
				'820B 2507 D551',
				'820B 2507 D553',
				'820B 2507 D554',
				'820B 2507 D556',
				'820B 2507 D557',
				'820B 2507 D558',
				'820B 2507 D559',
				'820B 2507 D561',
				'820B 2507 D564',
				'820B 2507 D565',
				'820B 2507 D572',
				'820B 2507 D573',
				'820B 2507 D574',
				'820B 2507 D575',
				'820B 2507 D580',
				'820B 2507 D581',
				'820B 2507 D582',
				'820B 2507 D583',
				'820B 2507 D586',
				'820B 2507 D587',
				'820B 2507 D589',
				'820B 2507 D591',
				'820B 2507 D592',
				'820B 2507 D594',
				'820B 2507 D595',
				'820B 2507 D604',
				'820B 2507 D606',
				'820B 2507 D608',
				'820B 2507 D609',
				'820B 2507 D620',
				'820B 2507 D621',
				'820B 2507 D622',
				'820B 2507 D623',
				'820B 2507 D624',
				'820B 2507 D626',
				'820B 2507 D627',
				'820B 2507 D628',
				'820B 2507 D633',
				'820B 2507 D634',
				'820B 2507 D635',
				'820B 2507 D638',
				'820B 2507 D639',
				'820B 2507 D640',
				'820B 2507 D641',
				'820B 2507 D644',
				'820B 2507 D645',
				'820B 2507 D646',
				'820B 2507 D647',
				'820B 2507 D648',
				'820B 2507 D649',
				'820B 2507 D650',
				'820B 2507 D651',
				'820B 2507 D652',
				'820B 2507 D653',
				'820B 2507 D656',
				'820B 2507 D658',
				'820B 2507 D660',
				'820B 2507 D661',
				'820B 2507 D662',
				'820B 2507 D663',
				'820B 2507 D664',
				'820B 2507 D665',
				'820B 2507 D666',
				'820B 2507 D667',
				'820B 2507 D668',
				'820B 2507 D669',
				'820B 2507 D707',
				'820B 2507 D70A',
				'820B 2507 D710',
				'820B 2507 D711',
				'820B 2507 D712',
				'820B 2507 D715',
				'820B 2507 D717',
				'820B 2507 D718',
				'820B 2507 D720',
				'820B 2507 D722',
				'820B 2507 D724',
				'820B 2507 D726',
				'820B 2507 D727',
				'820B 2507 D729',
				'820B 2507 D733',
				'820B 2507 D734',
				'820B 2507 D741',
				'820B 2507 D772',
				'820B 2507 D773',
				'820B 2507 D780',
				'820B 2507 D781',
				'820B 2507 D783',
				'820B 2507 D790',
				'820B 2507 D792',
				'820B 2507 D793',
				'820B 2507 D794',
				'820B 2507 D795',
				'820B 2507 D798',
				'820B 2507 D800',
				'820B 2507 D801',
				'820B 2507 D802',
				'820B 2507 D803',
				'820B 2507 D804',
				'820B 2507 D805',
				'820B 2507 D806',
				'820B 2507 D808',
				'820B 2507 D900',
				'820B 2507 D910',
				'820B 2507 D911',
				'820B 2507 D924',
				'820B 2507 D925',
				'820B 2507 D928',
				'820B 2507 D930',
				'820B 6207 D003',
				'820B 6207 D016',
				'820B 6207 D047',
				'820B 6207 D062',
				'820B 6207 D067',
				'820B 6207 D085',
				'820B 6207 D088',
				'820B 6207 D091',
				'820B 6207 D095',
				'820B 6207 D637',
				'820B 6207 D655',
				'820B 6207 D656',
				'820B 6207 D660',
				'820B 6207 D670',
				'820B 6207 D671',
				'820B 6207 DA05',
				'820B 6207 DA08',
				'820B 6207 DA12',
				'820B 6207 DB04',
				'820B 6207 DBS0',
				'820B 6207 DD01',
				'820B 6207 DD03',
				'820B 6207 DD06',
				'820B 6207 DE02',
				'820B 6207 DF05',
				'820B 6207 DG04',
				'820B 6207 DH04',
				'820B 6207 DH06',
				'820B 6207 DH11',
				'820B 6207 DK04',
				'820B 6207 DL00',
				'820B 6207 DL01',
				'820B 6207 DT26',
				'820B 6207 DT42',
				'820B 6207 DT50',
				'8400 2507 1071',
				'8400 2507 1072',
				'8400 2507 1075',
				'8400 2507 1076',
				'8400 2507 1094',
				'8400 2507 1097',
				'8400 2507 1201',
				'8400 2507 1339',
				'8400 2507 1420',
				'8400 2507 1451',
				'8400 2507 9036',
				'8400 2507 9037',
				'8400 2507 9223',
				'8400 2507 9227',
				'8400 2507 9249',
				'8400 2507 9258',
				'8400 2507 9328',
				'8400 2507 9337',
				'8400 2507 9341',
				'8400 2507 9342',
				'8400 2507 9345',
				'8400 2507 9346',
				'8400 2507 9364',
				'8400 2507 9407',
				'8400 2507 OM09',
				'8400 2507 OM10',
				'8400 2507 OM11',
				'8400 2507 OM12',
				'8400 2507 OM14',
				'8400 2507 TC10',
				'8400 6207 QA17',
				'8400 6207 QA18',
				'8400 6207 QF21',
				'8401 2507 1109',
				'8401 2507 1113',
				'8401 2507 1116',
				'8401 2507 1123',
				'8401 2507 1125',
				'8401 2507 1127',
				'8401 2507 1129',
				'8401 2507 1131',
				'8401 2507 1132',
				'8401 2507 1133',
				'8401 2507 1135',
				'8401 2507 1136',
				'8401 2507 1160',
				'8401 2507 1162',
				'8401 2507 1166',
				'8401 2507 1169',
				'8401 2507 1174',
				'8401 2507 1206',
				'8401 2507 1207',
				'8401 2507 1208',
				'8401 2507 1209',
				'8401 2507 1212',
				'8401 2507 1214',
				'8401 2507 1215',
				'8401 2507 1216',
				'8401 2507 1219',
				'8401 2507 1231',
				'8401 2507 1237',
				'8401 2507 1238',
				'8401 2507 1260',
				'8401 2507 1262',
				'8581 2507 9188',
				'8581 2507 QA11',
				'8581 2507 QC37',
				'8581 2507 QE24',
				'8581 6207 9103',
				'8581 6207 9107',
				'8581 6207 QA10',
				'8581 6207 QB21',
				'8581 6207 QB32',
				'8581 6207 QB35',
				'8581 6207 QC36',
				'8581 6207 QK06',
				'8581 6207 QK08',
				'8950 2507 1401',
				'8950 2507 1409',
				'8950 2507 1429',
				'8950 2507 HS01',
				'8950 2507 HS02',
				'8950 2507 HS03',
				'8950 2507 HS04',
				'8950 2507 SS05',
				'8950 2507 SS06',
				'8950 2507 SS07',
				'8950 2507 SS08',
				'8950 2507 SS09',
				'8950 2507 SS10',
				'8950 2507 SS11',
				'8950 2507 SS12',
				'8950 2507 SS14',
				'8950 2507 SS16',
				'8950 2507 SS17',
				'8950 2507 SS18',
				'8950 2507 SS19',
				'8950 6207 1608'
			)
			-- Just include records where we found a match in eCAPRIS table
			AND ecapris_subproject_funding.id IS NOT NULL
	)
UPDATE moped_proj_funding
SET
	ecapris_funding_id = funding_to_link_todos.fao_id,
	ecapris_subproject_id = funding_to_link_todos.ecapris_subproject_id,
	should_use_ecapris_amount = TRUE
FROM
	funding_to_link_todos
WHERE
	moped_proj_funding.proj_funding_id = funding_to_link_todos.proj_funding_id;
