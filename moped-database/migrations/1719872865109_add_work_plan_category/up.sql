DROP VIEW IF EXISTS component_arcgis_online_view;
DROP VIEW IF EXISTS project_list_view;

-- Create view again without project_development_status columns that are now moved to the component level in component_arcgis_online_view
CREATE OR REPLACE VIEW project_list_view AS WITH project_person_list_lookup AS (
    SELECT
        mpp.project_id,
        string_agg(DISTINCT concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ','::text) AS project_team_members
    FROM moped_proj_personnel AS mpp
    INNER JOIN moped_users AS mu ON mpp.user_id = mu.user_id
    INNER JOIN moped_proj_personnel_roles AS mppr ON mpp.project_personnel_id = mppr.project_personnel_id
    INNER JOIN moped_project_roles AS mpr ON mppr.project_role_id = mpr.project_role_id
    WHERE mpp.is_deleted = false AND mppr.is_deleted = false
    GROUP BY mpp.project_id
),

funding_sources_lookup AS (
    SELECT
        mpf.project_id,
        string_agg(DISTINCT mfs.funding_source_name, ', '::text ORDER BY mfs.funding_source_name) AS funding_source_name,
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
    FROM moped_proj_funding AS mpf
    LEFT JOIN moped_fund_sources AS mfs ON mpf.funding_source_id = mfs.funding_source_id
    LEFT JOIN moped_fund_programs AS mfp ON mpf.funding_program_id = mfp.funding_program_id
    WHERE mpf.is_deleted = false
    GROUP BY mpf.project_id
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
    INNER JOIN moped_project AS parent ON children.parent_project_id = parent.project_id
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
    FROM moped_proj_work_activity AS mpwa
    LEFT JOIN LATERAL jsonb_array_elements(mpwa.task_orders) AS task_order_objects (task_order_object) ON true
    WHERE 1 = 1 AND mpwa.is_deleted = false
    GROUP BY mpwa.project_id
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
        FROM moped_project AS parent_projects
        LEFT JOIN moped_project AS child_projects ON parent_projects.project_id = child_projects.parent_project_id
        GROUP BY parent_projects.project_id
        ORDER BY parent_projects.project_id
    )

    SELECT
        projects.project_id,
        array_agg(DISTINCT project_districts.council_district_id) FILTER (WHERE project_districts.council_district_id IS NOT null) AS project_council_districts,
        array_agg(DISTINCT project_and_children_districts.council_district_id) FILTER (WHERE project_and_children_districts.council_district_id IS NOT null) AS project_and_child_project_council_districts
    FROM parent_child_project_map AS projects
    LEFT JOIN project_council_district_map AS project_and_children_districts ON projects.self_and_children_project_ids = project_and_children_districts.project_id
    LEFT JOIN project_council_district_map AS project_districts ON projects.project_id = project_districts.project_id
    GROUP BY projects.project_id
),

min_confirmed_phase_dates AS (
    WITH min_dates AS (
        SELECT
            phases.project_id,
            min(phases.phase_start) AS min_date
        FROM moped_proj_phases AS phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_start IS NOT null AND phases.is_phase_start_confirmed = true AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
        UNION ALL
        SELECT
            phases.project_id,
            min(phases.phase_end) AS min_date
        FROM moped_proj_phases AS phases
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
        FROM moped_proj_phases AS phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_start IS NOT null AND phases.is_phase_start_confirmed = false AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
        UNION ALL
        SELECT
            phases.project_id,
            min(phases.phase_end) AS min_date
        FROM moped_proj_phases AS phases
        LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
        WHERE true AND phases.phase_end IS NOT null AND phases.is_phase_end_confirmed = false AND moped_phases.phase_name_simple = 'Complete'::text AND phases.is_deleted = false
        GROUP BY phases.project_id
    )

    SELECT
        min_dates.project_id,
        min(min_dates.min_date) AS min_phase_date
    FROM min_dates
    GROUP BY min_dates.project_id
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
        FROM moped_proj_components AS components
        LEFT JOIN feature_signals ON components.project_component_id = feature_signals.component_id
        WHERE true AND components.is_deleted = false AND components.project_id = mp.project_id AND feature_signals.signal_id IS NOT null AND feature_signals.is_deleted = false
    ) AS project_feature,
    fsl.funding_source_name,
    fsl.funding_source_and_program_names,
    ptl.type_name,
    (
        SELECT min(phases.phase_start) AS min
        FROM moped_proj_phases AS phases
        WHERE true AND phases.project_id = mp.project_id AND phases.phase_id = 9 AND phases.is_deleted = false
    ) AS construction_start_date,
    (
        SELECT max(phases.phase_end) AS max
        FROM moped_proj_phases AS phases
        WHERE true AND phases.project_id = mp.project_id AND phases.phase_id = 11 AND phases.is_deleted = false
    ) AS completion_end_date,
    mcpd.min_phase_date AS substantial_completion_date,
    CASE
        WHEN mcpd.min_phase_date IS NOT null THEN null::timestamp with time zone
        ELSE mepd.min_phase_date
    END AS substantial_completion_date_estimated,
    (
        SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
        FROM moped_proj_personnel AS mpp
        INNER JOIN moped_users AS users ON mpp.user_id = users.user_id
        INNER JOIN moped_proj_personnel_roles AS mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        INNER JOIN moped_project_roles AS mpr ON mppr.project_role_id = mpr.project_role_id
        WHERE 1 = 1 AND mpr.project_role_name = 'Inspector'::text AND mpp.is_deleted = false AND mppr.is_deleted = false AND mpp.project_id = mp.project_id
        GROUP BY mpp.project_id
    ) AS project_inspector,
    (
        SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
        FROM moped_proj_personnel AS mpp
        INNER JOIN moped_users AS users ON mpp.user_id = users.user_id
        INNER JOIN moped_proj_personnel_roles AS mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        INNER JOIN moped_project_roles AS mpr ON mppr.project_role_id = mpr.project_role_id
        WHERE 1 = 1 AND mpr.project_role_name = 'Designer'::text AND mpp.is_deleted = false AND mppr.is_deleted = false AND mpp.project_id = mp.project_id
        GROUP BY mpp.project_id
    ) AS project_designer,
    (
        SELECT string_agg(tags.name, ', '::text) AS string_agg
        FROM moped_proj_tags AS ptags
        INNER JOIN moped_tags AS tags ON ptags.tag_id = tags.id
        WHERE 1 = 1 AND ptags.is_deleted = false AND ptags.project_id = mp.project_id
        GROUP BY ptags.project_id
    ) AS project_tags,
    concat(added_by_user.first_name, ' ', added_by_user.last_name) AS added_by,
    mpcs.components,
    districts.project_council_districts,
    districts.project_and_child_project_council_districts
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
LEFT JOIN min_confirmed_phase_dates AS mcpd ON mp.project_id = mcpd.project_id
LEFT JOIN min_estimated_phase_dates AS mepd ON mp.project_id = mepd.project_id
LEFT JOIN LATERAL (
    SELECT
        mpn.project_note,
        mpn.created_at AS date_created
    FROM moped_proj_notes AS mpn
    WHERE mpn.project_id = mp.project_id AND mpn.project_note_type = 2 AND mpn.is_deleted = false
    ORDER BY mpn.created_at DESC
    LIMIT 1
) AS proj_status_update ON true
WHERE mp.is_deleted = false
GROUP BY mp.project_id, mp.project_name, mp.project_description, ppll.project_team_members, mp.ecapris_subproject_id, mp.date_added, mp.is_deleted, me.entity_name, mel.entity_name, mp.updated_at, mp.interim_project_id, mp.parent_project_id, mp.knack_project_id, current_phase.phase_name, current_phase.phase_key, current_phase.phase_name_simple, ptl.type_name, mpcs.components, fsl.funding_source_name, fsl.funding_source_and_program_names, added_by_user.first_name, added_by_user.last_name, mpps.name, cpl.children_project_ids, proj_status_update.project_note, proj_status_update.date_created, work_activities.workgroup_contractors, work_activities.contract_numbers, work_activities.task_order_names, work_activities.task_order_names_short, work_activities.task_orders, districts.project_council_districts, districts.project_and_child_project_council_districts, mepd.min_phase_date, mcpd.min_phase_date;

-- Create function to determine project development status date and reuse for other date formats in view
CREATE OR REPLACE FUNCTION public.get_project_development_status_date(latest_public_meeting_date timestamptz, earliest_active_or_construction_phase_date timestamptz, substantial_completion_date timestamptz, substantial_completion_date_estimated timestamptz, current_phase_simple text)
RETURNS timestamptz
LANGUAGE plpgsql
AS $function$
BEGIN
    IF lower(current_phase_simple) = 'complete' AND substantial_completion_date IS NOT null THEN 
        RETURN substantial_completion_date;
    ELSIF substantial_completion_date_estimated IS NOT null THEN
        RETURN substantial_completion_date_estimated;
    ELSIF latest_public_meeting_date IS NOT null THEN 
        RETURN latest_public_meeting_date;
    ELSIF earliest_active_or_construction_phase_date IS NOT null THEN 
        RETURN earliest_active_or_construction_phase_date;
    ELSE
        RETURN null;
    END IF;
END;
$function$;

-- Create function to determine project development status date and reuse for other date formats in view
CREATE OR REPLACE FUNCTION public.get_project_development_status(latest_public_meeting_date timestamptz, earliest_active_or_construction_phase_date timestamptz, substantial_completion_date timestamptz, substantial_completion_date_estimated timestamptz, current_phase_simple text)
RETURNS timestamptz
LANGUAGE plpgsql
AS $function$
BEGIN
    IF lower(current_phase_simple) = 'complete' AND substantial_completion_date IS NOT null THEN
        RETURN 'Complete';
    ELSIF substantial_completion_date_estimated IS NOT null THEN
        IF lower(current_phase_simple) = 'construction' THEN 
            RETURN 'Estimated End Date (In Construction)';
        ELSE
            RETURN 'Estimated End Date';
        END IF;
    ELSIF latest_public_meeting_date IS NOT null THEN
        RETURN 'Estimated Public Meeting Date';
    ELSIF earliest_active_or_construction_phase_date IS NOT null THEN 
        RETURN 'Estimated Start of Project Development';
    END IF;
END;
$function$;

-- Create view again with project_development_status columns
CREATE OR REPLACE VIEW component_arcgis_online_view AS WITH work_types AS (
    SELECT
        mpcwt.project_component_id,
        string_agg(mwt.name, ', '::text) AS work_types
    FROM moped_proj_component_work_types AS mpcwt
    LEFT JOIN moped_work_types AS mwt ON mpcwt.work_type_id = mwt.id
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
        st_asgeojson(st_union(array_agg(feature_union.geography)))::json AS geometry,
        st_asgeojson(st_union(array_agg(feature_union.line_geography)))::json AS line_geometry,
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
    ) AS feature_union
    GROUP BY feature_union.component_id
),

subcomponents AS (
    SELECT
        mpcs.project_component_id,
        string_agg(ms.subcomponent_name, ', '::text) AS subcomponents
    FROM moped_proj_components_subcomponents AS mpcs
    LEFT JOIN moped_subcomponents AS ms ON mpcs.subcomponent_id = ms.subcomponent_id
    WHERE mpcs.is_deleted = false
    GROUP BY mpcs.project_component_id
),

component_tags AS (
    SELECT
        mpct.project_component_id,
        string_agg((mct.type || ' - '::text) || mct.name, ', '::text) AS component_tags
    FROM moped_proj_component_tags AS mpct
    LEFT JOIN moped_component_tags AS mct ON mpct.component_tag_id = mct.id
    WHERE mpct.is_deleted = false
    GROUP BY mpct.project_component_id
),

related_projects AS (
    SELECT
        pmp.project_id,
        concat_ws(', '::text, pmp.project_id, string_agg(cmp.project_id::text, ', '::text)) AS related_project_ids_with_self,
        concat_ws(', '::text, lpad(pmp.project_id::text, 5, '0'::text), string_agg(lpad(cmp.project_id::text, 5, '0'::text), ', '::text)) AS related_project_ids_searchable_with_self
    FROM moped_project AS pmp
    LEFT JOIN moped_project AS cmp ON pmp.project_id = cmp.parent_project_id
    WHERE cmp.is_deleted = false
    GROUP BY pmp.project_id
),

-- find latest completed or estimated "Public meeting" milestone date
latest_public_meeting_date AS (
    SELECT
        mpm.project_id,
        coalesce(max(mpm.date_actual), max(mpm.date_estimate)) AS latest
    FROM moped_proj_milestones AS mpm
    WHERE mpm.milestone_id = 65 AND mpm.is_deleted = false
    GROUP BY mpm.project_id
),

-- earliest estimated or confirmed date of any phase with simple name that is “Active” or “Construction”
earliest_active_or_construction_phase_date AS (
    SELECT
        mpp.project_id,
        min(mpp.phase_start) AS earliest
    FROM moped_proj_phases AS mpp
    LEFT JOIN moped_phases AS mp ON mpp.phase_id = mp.phase_id
    WHERE mp.phase_name_simple IN ('Active', 'Construction') AND mpp.is_deleted = false
    GROUP BY mpp.project_id
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
    council_districts.council_districts_searchable,
    NOT coalesce(council_districts.council_districts IS null OR council_districts.council_districts = ''::text, false) AS is_within_city_limits,
    comp_geography.length_feet_total,
    round(comp_geography.length_feet_total::numeric / 5280::numeric, 2) AS length_miles_total,
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
    plv.funding_source_and_program_names AS funding_sources,
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
    plv.parent_project_name AS parent_project_name_full,
    rp.related_project_ids_with_self AS related_project_ids,
    rp.related_project_ids_searchable_with_self AS related_project_ids_searchable,
    plv.knack_project_id AS knack_data_tracker_project_record_id,
    plv.project_url,
    (plv.project_url || '?tab=map&project_component_id='::text) || mpc.project_component_id::text AS component_url,
    get_project_development_status(lpmd.latest, eaocpd.earliest, coalesce(mpc.completion_date, plv.substantial_completion_date), plv.substantial_completion_date_estimated, current_phase.phase_name_simple)::text AS project_development_status,
    get_project_development_status_date(lpmd.latest, eaocpd.earliest, coalesce(mpc.completion_date, plv.substantial_completion_date), plv.substantial_completion_date_estimated, current_phase.phase_name_simple)::text AS project_development_status_date,
    9999 AS project_development_status_date_calendar_year,
    'placeholder text'::text AS project_development_status_date_calendar_year_month,
    'placeholder text'::text AS project_development_status_date_calendar_year_month_numeric,
    'placeholder text'::text AS project_development_status_date_calendar_year_quarter,
    999 AS project_development_status_date_fiscal_year,
    'placeholder text'::text AS project_development_status_date_fiscal_year_quarter,
    plv.added_by AS project_added_by
FROM moped_proj_components AS mpc
LEFT JOIN comp_geography ON mpc.project_component_id = comp_geography.project_component_id
LEFT JOIN council_districts ON mpc.project_component_id = council_districts.project_component_id
LEFT JOIN subcomponents ON mpc.project_component_id = subcomponents.project_component_id
LEFT JOIN work_types ON mpc.project_component_id = work_types.project_component_id
LEFT JOIN component_tags ON mpc.project_component_id = component_tags.project_component_id
LEFT JOIN project_list_view AS plv ON mpc.project_id = plv.project_id
LEFT JOIN current_phase_view AS current_phase ON mpc.project_id = current_phase.project_id
LEFT JOIN moped_phases AS mph ON mpc.phase_id = mph.phase_id
LEFT JOIN moped_components AS mc ON mpc.component_id = mc.component_id
LEFT JOIN related_projects AS rp ON mpc.project_id = rp.project_id
LEFT JOIN latest_public_meeting_date AS lpmd ON mpc.project_id = lpmd.project_id
LEFT JOIN earliest_active_or_construction_phase_date AS eaocpd ON mpc.project_id = eaocpd.project_id
WHERE mpc.is_deleted = false AND plv.is_deleted = false;
