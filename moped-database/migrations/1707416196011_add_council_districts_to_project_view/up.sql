-- no "IF EXISTS" because if it doesn't exist, we have bigger problems and we want this to bail
DROP VIEW public.project_list_view CASCADE;

CREATE OR REPLACE VIEW public.project_list_view AS
WITH project_person_list_lookup AS (
    SELECT
        mpp.project_id,
        string_agg(
            DISTINCT concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ','::text
        ) AS project_team_members
    FROM moped_proj_personnel AS mpp
    INNER JOIN moped_users AS mu ON mpp.user_id = mu.user_id
    INNER JOIN moped_proj_personnel_roles AS mppr ON mpp.project_personnel_id = mppr.project_personnel_id
    INNER JOIN moped_project_roles AS mpr ON mppr.project_role_id = mpr.project_role_id
    WHERE mpp.is_deleted = false
        AND mppr.is_deleted = false
    GROUP BY mpp.project_id
),

funding_sources_lookup AS (
    SELECT
        mpf_1.project_id,
        string_agg(mfs.funding_source_name, ', '::text) AS funding_source_name
    FROM moped_proj_funding AS mpf_1
    LEFT JOIN moped_fund_sources AS mfs ON mpf_1.funding_source_id = mfs.funding_source_id
    WHERE mpf_1.is_deleted = false
    GROUP BY mpf_1.project_id
),

project_type_lookup AS (
    SELECT
        mpt.project_id,
        string_agg(mt.type_name, ', '::text) AS type_name
    FROM moped_project_types AS mpt
    LEFT JOIN moped_types AS mt ON mpt.project_type_id = mt.type_id AND mpt.is_deleted = false
    GROUP BY mpt.project_id
),

child_project_lookup AS (
    SELECT
        jsonb_agg(children.project_id) AS children_project_ids,
        children.parent_project_id AS parent_id
    FROM moped_project AS children
    INNER JOIN moped_project AS parent ON (children.parent_project_id = parent.project_id)
    WHERE children.is_deleted = false
    GROUP BY parent_id
),

work_activities AS (
    SELECT
        project_id,
        string_agg(
            task_order_objects.task_order_object ->> 'display_name'::text,
            ', '::text
        ) AS task_order_names,
        string_agg(
            task_order_objects.task_order_object ->> 'task_order'::text,
            ', '::text
        ) AS task_order_names_short,
        jsonb_agg(DISTINCT task_order_objects.task_order_object) FILTER (
            WHERE task_order_objects.task_order_object IS NOT null
        ) AS task_orders,
        string_agg(
            DISTINCT mpwa.workgroup_contractor,
            ', '::text
        ) AS workgroup_contractors,
        string_agg(
            mpwa.contract_number,
            ', '::text
        ) AS contract_numbers
    FROM moped_proj_work_activity AS mpwa
    LEFT JOIN LATERAL jsonb_array_elements(mpwa.task_orders) AS task_order_objects (task_order_object)
        ON true WHERE 1 = 1
        AND mpwa.is_deleted = false
    GROUP BY
        mpwa.project_id
),

moped_proj_components_subtypes AS (
    SELECT
        mpc.project_id,
        string_agg(DISTINCT mc.component_name_full, ', '::text) AS components
    FROM moped_proj_components AS mpc
    LEFT JOIN moped_components AS mc ON mpc.component_id = mc.component_id
    WHERE mpc.is_deleted = false
    GROUP BY mpc.project_id
),

project_district_association AS (

    WITH
    project_council_district_map AS (
        SELECT DISTINCT
            project_id,
            unnest(council_districts) AS council_district
        FROM project_geography
    ),

    parent_child_project_map AS (
        SELECT
            parent_projects.project_id,
            unnest(
                ARRAY[parent_projects.project_id]
                || array_agg(child_projects.project_id)
            ) AS self_and_children_project_ids
        FROM moped_project AS parent_projects
        LEFT JOIN moped_project AS child_projects ON parent_projects.project_id = child_projects.parent_project_id
        GROUP BY parent_projects.project_id
        ORDER BY parent_projects.project_id ASC
    )

    SELECT
        projects.project_id,
        array_agg(DISTINCT project_districts.council_district) FILTER (
            WHERE project_districts.council_district IS NOT null
        ) AS self_alone_council_districts,
        array_agg(DISTINCT districts.council_district) FILTER (
            WHERE districts.council_district IS NOT null
        ) AS self_and_children_council_districts
    FROM parent_child_project_map AS projects
    LEFT JOIN
        project_council_district_map AS districts
        ON (projects.self_and_children_project_ids = districts.project_id)
    LEFT JOIN project_council_district_map AS project_districts ON (projects.project_id = project_districts.project_id)
    GROUP BY projects.project_id
)

SELECT
    mp.project_id,
    mp.project_name,
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
    'https://mobility.austin.gov/moped/projects/' || mp.project_id::text AS project_url,
    'https://mobility.austin.gov/moped/projects/' || mp.parent_project_id::text AS parent_project_url,
    proj_status_update.project_note AS project_status_update,
    proj_status_update.date_created AS project_status_update_date_created,
    work_activities.workgroup_contractors,
    work_activities.contract_numbers,
    work_activities.task_order_names,
    work_activities.task_order_names_short,
    work_activities.task_orders,
    'placeholder text' AS project_development_status,
    '2024-01-01T00:00:00-06:00' AS project_development_status_date,
    9999 AS project_development_status_date_calendar_year,
    'placeholder text' AS project_development_status_date_calendar_year_month,
    'placeholder text' AS project_development_status_date_calendar_year_month_numeric,
    'placeholder text' AS project_development_status_date_calendar_year_quarter,
    999 AS project_development_status_date_fiscal_year,
    'placeholder text' AS project_development_status_date_fiscal_year_quarter,
    (
        SELECT project_name
        FROM moped_project
        WHERE project_id = mp.parent_project_id
    ) AS parent_project_name,
    cpl.children_project_ids,
    string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partners,
    (
        SELECT
            json_agg(
                json_build_object(
                    'signal_id',
                    feature_signals.signal_id,
                    'knack_id',
                    feature_signals.knack_id,
                    'location_name',
                    feature_signals.location_name,
                    'signal_type',
                    feature_signals.signal_type,
                    'id',
                    feature_signals.id
                )
            )
        FROM moped_proj_components AS components
        LEFT JOIN feature_signals
            ON (components.project_component_id = feature_signals.component_id)
        WHERE true
            AND components.is_deleted = false
            AND components.project_id = mp.project_id
            AND feature_signals.signal_id IS NOT null
            AND feature_signals.is_deleted = false
    ) AS project_feature,
    fsl.funding_source_name,
    ptl.type_name,
    ( -- get the date of the construction phase with the earliest start date
        SELECT min(phases.phase_start)
        FROM moped_proj_phases AS phases
        WHERE true
            AND phases.project_id = mp.project_id
            AND phases.phase_id = 9 -- phase_id 9 is construction
            AND phases.is_deleted = false
    ) AS construction_start_date,
    ( -- get the date of the completion phase with the latest end date
        SELECT max(phases.phase_end)
        FROM moped_proj_phases AS phases
        WHERE true
            AND phases.project_id = mp.project_id
            AND phases.phase_id = 11 -- phase_id 11 is complete
            AND phases.is_deleted = false
    ) AS completion_end_date,
    ( -- get the earliest confirmed phase_start or phase_end with a simple phase of 'Complete' 
        SELECT min(min_confirmed_date)
        FROM (
            -- earliest confirmed phase start
            SELECT min(phases.phase_start) AS min_confirmed_date
            FROM
                moped_proj_phases AS phases
            LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
            WHERE
                true
                AND phases.phase_start IS NOT null
                AND phases.is_phase_start_confirmed = true
                AND phases.project_id = mp.project_id
                AND moped_phases.phase_name_simple = 'Complete'
                AND phases.is_deleted = false
            UNION ALL
            -- earliest confirmed phase end
            SELECT min(phases.phase_end) AS min_confirmed_date
            FROM
                moped_proj_phases AS phases
            LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
            WHERE
                true
                AND phases.phase_end IS NOT null
                AND phases.is_phase_end_confirmed = true
                AND phases.project_id = mp.project_id
                AND moped_phases.phase_name_simple = 'Complete'
                AND phases.is_deleted = false
        ) AS min_confirmed_dates
    ) AS substantial_completion_date,
    ( -- get me a list of the inspectors for this project
        SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
        FROM moped_proj_personnel AS mpp
        INNER JOIN moped_users AS users ON mpp.user_id = users.user_id
        INNER JOIN moped_proj_personnel_roles AS mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        INNER JOIN moped_project_roles AS mpr ON mppr.project_role_id = mpr.project_role_id
        WHERE 1 = 1
            AND mpr.project_role_name = 'Inspector'::text
            AND mpp.is_deleted = false
            AND mppr.is_deleted = false
            AND mpp.project_id = mp.project_id
        GROUP BY mpp.project_id
    ) AS project_inspector,
    ( -- get me a list of the designers for this project
        SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
        FROM moped_proj_personnel AS mpp
        INNER JOIN moped_users AS users ON mpp.user_id = users.user_id
        INNER JOIN moped_proj_personnel_roles AS mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        INNER JOIN moped_project_roles AS mpr ON mppr.project_role_id = mpr.project_role_id
        WHERE 1 = 1
            AND mpr.project_role_name = 'Designer'::text
            AND mpp.is_deleted = false
            AND mppr.is_deleted = false
            AND mpp.project_id = mp.project_id
        GROUP BY mpp.project_id
    ) AS project_designer,
    ( -- get me all of the tags added to a project
        SELECT string_agg(tags.name, ', '::text) AS string_agg
        FROM moped_proj_tags AS ptags
        INNER JOIN moped_tags AS tags ON ptags.tag_id = tags.id
        WHERE 1 = 1
            AND ptags.is_deleted = false
            AND ptags.project_id = mp.project_id
        GROUP BY ptags.project_id
    ) AS project_tags,
    concat(added_by_user.first_name, ' ', added_by_user.last_name) AS added_by,
    mpcs.components,
    districts.self_alone_council_districts,
    districts.self_and_children_council_districts
FROM moped_project AS mp
LEFT JOIN project_person_list_lookup AS ppll ON mp.project_id = ppll.project_id
LEFT JOIN funding_sources_lookup AS fsl ON mp.project_id = fsl.project_id
LEFT JOIN project_type_lookup AS ptl ON mp.project_id = ptl.project_id
LEFT JOIN moped_entity AS me ON mp.project_sponsor = me.entity_id
LEFT JOIN moped_entity AS mel ON mp.project_lead_id = mel.entity_id
LEFT JOIN moped_proj_partners AS mpp2 ON mp.project_id = mpp2.project_id AND mpp2.is_deleted = false
LEFT JOIN moped_entity AS me2 ON mpp2.entity_id = me2.entity_id
LEFT JOIN work_activities ON mp.project_id = work_activities.project_id
LEFT JOIN moped_users AS added_by_user ON mp.added_by = added_by_user.user_id
LEFT JOIN current_phase_view AS current_phase ON mp.project_id = current_phase.project_id
LEFT JOIN moped_public_process_statuses AS mpps ON mp.public_process_status_id = mpps.id
LEFT JOIN child_project_lookup AS cpl ON mp.project_id = cpl.parent_id
LEFT JOIN moped_proj_components_subtypes AS mpcs ON mp.project_id = mpcs.project_id
LEFT JOIN project_district_association AS districts ON mp.project_id = districts.project_id
LEFT JOIN LATERAL
    (
        SELECT
            mpn.project_note,
            mpn.date_created
        FROM moped_proj_notes AS mpn
        WHERE mpn.project_id = mp.project_id AND mpn.project_note_type = 2 AND mpn.is_deleted = false
        ORDER BY mpn.date_created DESC
        LIMIT 1
    ) AS proj_status_update ON true
WHERE
    mp.is_deleted = false
GROUP BY
    mp.project_id,
    mp.project_name,
    mp.project_description,
    ppll.project_team_members,
    mp.ecapris_subproject_id,
    mp.date_added,
    mp.is_deleted,
    me.entity_name,
    mel.entity_name,
    mp.updated_at,
    mp.interim_project_id,
    mp.parent_project_id,
    mp.knack_project_id,
    current_phase.phase_name,
    current_phase.phase_key,
    current_phase.phase_name_simple,
    ptl.type_name,
    mpcs.components,
    fsl.funding_source_name,
    added_by_user.first_name,
    added_by_user.last_name,
    mpps.name,
    cpl.children_project_ids,
    proj_status_update.project_note,
    proj_status_update.date_created,
    work_activities.workgroup_contractors,
    work_activities.contract_numbers,
    work_activities.task_order_names,
    work_activities.task_order_names_short,
    work_activities.task_orders,
    districts.self_alone_council_districts,
    districts.self_and_children_council_districts;





CREATE VIEW component_arcgis_online_view AS
WITH work_types AS (
    SELECT
        mpcwt.project_component_id,
        string_agg(mwt.name, ', '::text) AS work_types
    FROM (
        moped_proj_component_work_types AS mpcwt
        LEFT JOIN moped_work_types AS mwt ON ((mpcwt.work_type_id = mwt.id))
    )
    WHERE (mpcwt.is_deleted = false)
    GROUP BY mpcwt.project_component_id
),

council_districts AS (
    SELECT
        features.component_id AS project_component_id,
        string_agg(DISTINCT (features_council_districts.council_district_id)::text, ', '::text) AS council_districts
    FROM (
        features_council_districts
        LEFT JOIN features ON ((features_council_districts.feature_id = features.id))
    )
    WHERE (features.is_deleted = false)
    GROUP BY features.component_id
),

comp_geography AS (
    SELECT
        feature_union.component_id AS project_component_id,
        string_agg(DISTINCT (feature_union.id)::text, ', '::text) AS feature_ids,
        (st_asgeojson(st_union(array_agg(feature_union.geography))))::json AS geometry,
        (st_asgeojson(st_union(array_agg(feature_union.line_geography))))::json AS line_geometry,
        string_agg(DISTINCT (feature_union.signal_id)::text, ', '::text) AS signal_ids,
        sum(feature_union.length_feet) AS length_feet_total
    FROM (
        SELECT
            feature_signals.id,
            feature_signals.component_id,
            (feature_signals.geography)::geometry AS geography,
            st_exteriorring((st_buffer(feature_signals.geography, (7)::double precision))::geometry) AS line_geography,
            feature_signals.signal_id,
            null::integer AS length_feet
        FROM feature_signals
        WHERE (feature_signals.is_deleted = false)
        UNION ALL
        SELECT
            feature_street_segments.id,
            feature_street_segments.component_id,
            (feature_street_segments.geography)::geometry AS geography,
            (feature_street_segments.geography)::geometry AS line_geography,
            null::integer AS signal_id,
            feature_street_segments.length_feet
        FROM feature_street_segments
        WHERE (feature_street_segments.is_deleted = false)
        UNION ALL
        SELECT
            feature_intersections.id,
            feature_intersections.component_id,
            (feature_intersections.geography)::geometry AS geography,
            st_exteriorring(
                (st_buffer(feature_intersections.geography, (7)::double precision))::geometry
            ) AS line_geography,
            null::integer AS signal_id,
            null::integer AS length_feet
        FROM feature_intersections
        WHERE (feature_intersections.is_deleted = false)
        UNION ALL
        SELECT
            feature_drawn_points.id,
            feature_drawn_points.component_id,
            (feature_drawn_points.geography)::geometry AS geography,
            st_exteriorring(
                (st_buffer(feature_drawn_points.geography, (7)::double precision))::geometry
            ) AS line_geography,
            null::integer AS signal_id,
            null::integer AS length_feet
        FROM feature_drawn_points
        WHERE (feature_drawn_points.is_deleted = false)
        UNION ALL
        SELECT
            feature_drawn_lines.id,
            feature_drawn_lines.component_id,
            (feature_drawn_lines.geography)::geometry AS geography,
            (feature_drawn_lines.geography)::geometry AS line_geography,
            null::integer AS signal_id,
            feature_drawn_lines.length_feet
        FROM feature_drawn_lines
        WHERE (feature_drawn_lines.is_deleted = false)
    ) AS feature_union
    GROUP BY feature_union.component_id
),

subcomponents AS (
    SELECT
        mpcs.project_component_id,
        string_agg(ms.subcomponent_name, ', '::text) AS subcomponents
    FROM (
        moped_proj_components_subcomponents AS mpcs
        LEFT JOIN moped_subcomponents AS ms ON ((mpcs.subcomponent_id = ms.subcomponent_id))
    )
    WHERE (mpcs.is_deleted = false)
    GROUP BY mpcs.project_component_id
),

component_tags AS (
    SELECT
        mpct.project_component_id,
        string_agg(((mct.type || ' - '::text) || mct.name), ', '::text) AS component_tags
    FROM (
        moped_proj_component_tags AS mpct
        LEFT JOIN moped_component_tags AS mct ON ((mpct.component_tag_id = mct.id))
    )
    WHERE (mpct.is_deleted = false)
    GROUP BY mpct.project_component_id
)

SELECT
    mpc.project_id,
    comp_geography.project_component_id,
    comp_geography.feature_ids,
    mpc.component_id,
    comp_geography.geometry,
    comp_geography.line_geometry,
    comp_geography.signal_ids,
    council_districts.council_districts,
    'placeholder text'::text AS council_districts_searchable,
    (
        NOT coalesce(
            ((council_districts.council_districts IS null) OR (council_districts.council_districts = ''::text)), false
        )
    ) AS is_within_city_limits,
    comp_geography.length_feet_total,
    round(((comp_geography.length_feet_total)::numeric / (5280)::numeric), 2) AS length_miles_total,
    mc.component_name,
    mc.component_subtype,
    mc.component_name_full,
    'placeholder text'::text AS component_categories,
    subcomponents.subcomponents AS component_subcomponents,
    work_types.work_types AS component_work_types,
    component_tags.component_tags,
    mpc.description AS component_description,
    mpc.interim_project_component_id,
    mpc.completion_date,
    coalesce(mpc.completion_date, plv.substantial_completion_date) AS substantial_completion_date,
    '2024-01-01T00:00:00-06:00'::text AS substantial_completion_date_estimated,
    mpc.srts_id,
    mpc.location_description AS component_location_description,
    plv.project_name,
    'placeholder text'::text AS project_name_descriptor,
    'placeholder text'::text AS project_name_with_descriptor,
    plv.project_description,
    plv.ecapris_subproject_id,
    plv.project_website,
    plv.updated_at AS project_updated_at,
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
    plv.funding_source_name,
    plv.type_name,
    plv.project_status_update,
    plv.project_status_update_date_created,
    plv.construction_start_date,
    plv.completion_end_date,
    plv.project_inspector,
    plv.project_designer,
    plv.project_tags,
    plv.workgroup_contractors,
    plv.contract_numbers,
    plv.parent_project_id,
    plv.parent_project_name,
    plv.parent_project_url,
    'placeholder text'::text AS parent_project_name_with_descriptor,
    'placeholder text'::text AS related_project_ids,
    'placeholder text'::text AS related_project_ids_searchable,
    plv.knack_project_id AS knack_data_tracker_project_record_id,
    plv.project_url,
    ((plv.project_url || '?tab=map&project_component_id='::text) || (mpc.project_component_id)::text) AS component_url,
    plv.project_development_status,
    plv.project_development_status_date,
    plv.project_development_status_date_calendar_year,
    plv.project_development_status_date_calendar_year_month,
    plv.project_development_status_date_calendar_year_month_numeric,
    plv.project_development_status_date_calendar_year_quarter,
    plv.project_development_status_date_fiscal_year,
    plv.project_development_status_date_fiscal_year_quarter,
    plv.added_by AS project_added_by
FROM (((((((((moped_proj_components AS mpc
    LEFT JOIN comp_geography ON ((mpc.project_component_id = comp_geography.project_component_id))
)
LEFT JOIN council_districts ON ((mpc.project_component_id = council_districts.project_component_id))
)
LEFT JOIN subcomponents ON ((mpc.project_component_id = subcomponents.project_component_id))
)
LEFT JOIN work_types ON ((mpc.project_component_id = work_types.project_component_id))
)
LEFT JOIN component_tags ON ((mpc.project_component_id = component_tags.project_component_id))
)
LEFT JOIN project_list_view AS plv ON ((mpc.project_id = plv.project_id))
)
LEFT JOIN current_phase_view AS current_phase ON ((mpc.project_id = current_phase.project_id))
)
LEFT JOIN moped_phases AS mph ON ((mpc.phase_id = mph.phase_id))
)
LEFT JOIN moped_components AS mc ON ((mpc.component_id = mc.component_id))
)
WHERE ((mpc.is_deleted = false) AND (plv.is_deleted = false));
