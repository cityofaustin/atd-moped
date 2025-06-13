-- Most recent migration: moped-database/migrations/default/1748534889272_create_notes_view/up.sql

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
    'placeholder text'::text AS component_categories,
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
