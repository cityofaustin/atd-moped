-- https://austin.maps.arcgis.com/home/item.html?id=4736ec7436d24d809f327a367adb638e#overview
SELECT
    comp_geography.project_component_id,
    mpc.project_id,
    comp_geography.feature_ids,
    mpc.component_id,
    comp_geography.geometry,
    comp_geography.signal_ids,
    council_districts.council_districts,
    description,
    mpc.is_deleted is_project_component_deleted,
    plv.is_deleted is_project_deleted,
    interim_project_component_id,
    subphase_id,
    completion_date,
    srts_id,
    location_description,
    project_name,
    project_description,
    ecapris_subproject_id,
    -- task_order,
    updated_at,
    mpc.phase_id AS component_phase_id,
    mph.phase_name AS component_phase_name,
    current_phase.phase_id AS project_phase_id,
    current_phase.phase_name AS project_phase_name,
    COALESCE(mph.phase_name, current_phase.phase_name) AS current_phase_name,
    project_team_members,
    project_sponsor,
    project_lead,
    public_process_status,
    interim_project_id,
    project_partner,
    task_order_name,
    project_feature,
    funding_source_name,
    type_name,
    project_note,
    construction_start_date,
    completion_end_date,
    project_inspector,
    project_designer,
    project_tags,
    contractors,
    contract_numbers,
    added_by
FROM
    moped_proj_components mpc
    -------- COMPNENTS JOIN GEOGRPAHY  --------
    LEFT JOIN (
        -------- COMPNENTS  JOIN FEATURES --------
        SELECT
            component_id AS project_component_id,
            STRING_AGG(DISTINCT id::text, ', ') AS feature_ids,
            ST_AsGeoJSON(ST_Union(ARRAY_AGG(geography))) AS "geometry",
            STRING_AGG(DISTINCT signal_id::text, ', ') AS signal_ids
            -- NULLIF(ARRAY_AGG(DISTINCT signal_id ORDER BY signal_id), '{NULL}') AS signal_ids
        FROM (
            -------- FEATUERS UNION --------
            SELECT
                id,
                feature_signals.component_id,
                feature_signals.geography::geometry,
                feature_signals.signal_id
            FROM
                feature_signals
            WHERE
                feature_signals.is_deleted = FALSE
            UNION ALL
            SELECT
                id,
                feature_street_segments.component_id,
                feature_street_segments.geography::geometry,
                NULL AS signal_id
            FROM
                feature_street_segments
            WHERE
                feature_street_segments.is_deleted = FALSE
            UNION ALL
            SELECT
                id,
                feature_intersections.component_id,
                feature_intersections.geography::geometry,
                NULL AS signal_id
            FROM
                feature_intersections
            WHERE
                feature_intersections.is_deleted = FALSE
            UNION ALL
            SELECT
                id,
                feature_drawn_points.component_id,
                feature_drawn_points.geography::geometry,
                NULL AS signal_id
            FROM
                feature_drawn_points
            WHERE
                feature_drawn_points.is_deleted = FALSE
            UNION ALL
            SELECT
                id,
                feature_drawn_lines.component_id,
                feature_drawn_lines.geography::geometry,
                NULL AS signal_id
            FROM
                feature_drawn_lines
            WHERE
                feature_drawn_lines.is_deleted = FALSE
                -------- END FEATUERS UNION --------
        ) feature_union
                GROUP BY
                    component_id
                    -------- END COMPNENTS JOIN FEATURES --------
    ) comp_geography ON comp_geography.project_component_id = mpc.project_component_id
    LEFT JOIN (
        -------- JOIN COUNCIL DISTRICTS  --------
        SELECT
            component_id AS project_component_id,
            STRING_AGG(DISTINCT council_district_id::text, ', ') AS council_districts
        FROM
            features_council_districts
            LEFT JOIN features ON features.id = features_council_districts.feature_id
        WHERE
            features.is_deleted = FALSE
        GROUP BY
            component_id) council_districts ON council_districts.project_component_id = mpc.project_component_id
    LEFT JOIN project_list_view plv ON plv.project_id = mpc.project_id
    LEFT JOIN current_phase_view current_phase ON mpc.project_id = current_phase.project_id
    LEFT JOIN moped_phases mph ON mpc.phase_id = mph.phase_id
    WHERE
        mpc.is_deleted = FALSE;
