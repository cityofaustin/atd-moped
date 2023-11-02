DROP VIEW IF EXISTS component_arcgis_online_view;
CREATE OR REPLACE VIEW component_arcgis_online_view AS (
    SELECT
        mpc.project_id,
        comp_geography.project_component_id,
        comp_geography.feature_ids,
        mpc.component_id,
        comp_geography.geometry,
        comp_geography.line_geometry,
        comp_geography.signal_ids,
        council_districts.council_districts,
        comp_geography.length_feet_total,
        mc.component_name,
        mc.component_subtype,
        ((mc.component_name || ' - '::text) || mc.component_subtype) AS component_name_full,
        subcomponents.subcomponents,
        work_types.work_types,
        component_tags.component_tags,
        mpc.description AS component_description,
        mpc.is_deleted AS is_project_component_deleted,
        plv.is_deleted AS is_project_deleted,
        mpc.interim_project_component_id,
        mpc.completion_date,
        mpc.srts_id,
        mpc.location_description,
        plv.project_name,
        plv.project_description,
        plv.ecapris_subproject_id,
        plv.updated_at,
        mpc.phase_id AS component_phase_id,
        mph.phase_name AS component_phase_name,
        mph.phase_name_simple AS component_phase_name_simple,
        current_phase.phase_id AS project_phase_id,
        current_phase.phase_name AS project_phase_name,
        current_phase.phase_name_simple AS project_phase_name_simple,
        COALESCE(mph.phase_name, current_phase.phase_name) AS current_phase_name,
        COALESCE(mph.phase_name_simple, current_phase.phase_name_simple) AS current_phase_name_simple,
        plv.project_team_members,
        plv.project_sponsor,
        plv.project_lead,
        plv.public_process_status,
        plv.interim_project_id,
        plv.project_partner,
        plv.task_order_names,
        plv.funding_source_name,
        plv.type_name,
        plv.project_note,
        plv.project_note_date_created,
        plv.construction_start_date,
        plv.completion_end_date,
        plv.project_inspector,
        plv.project_designer,
        plv.project_tags,
        plv.contractors,
        plv.contract_numbers,
        plv.knack_project_id AS knack_data_tracker_project_record_id,
        ('https://mobility.austin.gov/moped/projects/'::text || (plv.project_id)::text) AS project_url,
        ((('https://mobility.austin.gov/moped/projects/'::text || (plv.project_id)::text) || '?tab=map&project_component_id='::text) || (mpc.project_component_id)::text) AS component_url,
        plv.added_by
    FROM (((((((((moped_proj_components mpc
                                    LEFT JOIN (
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
                                                ST_ExteriorRing(ST_Buffer(feature_signals.geography,5)::geometry) AS line_geography,
                                                feature_signals.signal_id,
                                                NULL::integer AS length_feet
                                            FROM
                                                feature_signals
                                            WHERE (feature_signals.is_deleted = FALSE)
                                        UNION ALL
                                        SELECT
                                            feature_street_segments.id,
                                            feature_street_segments.component_id,
                                            (feature_street_segments.geography)::geometry AS geography,
                                            (feature_street_segments.geography)::geometry AS line_geography,
                                            NULL::integer AS signal_id,
                                            feature_street_segments.length_feet
                                        FROM
                                            feature_street_segments
                                        WHERE (feature_street_segments.is_deleted = FALSE)
                                    UNION ALL
                                    SELECT
                                        feature_intersections.id,
                                        feature_intersections.component_id,
                                        (feature_intersections.geography)::geometry AS geography,
                                        ST_ExteriorRing(ST_Buffer(feature_intersections.geography,5)::geometry) AS line_geography,
                                        NULL::integer AS signal_id,
                                        NULL::integer AS length_feet
                                    FROM
                                        feature_intersections
                                    WHERE (feature_intersections.is_deleted = FALSE)
                                UNION ALL
                                SELECT
                                    feature_drawn_points.id,
                                    feature_drawn_points.component_id,
                                    (feature_drawn_points.geography)::geometry AS geography,
                                    ST_ExteriorRing(ST_Buffer(feature_drawn_points.geography,5)::geometry) AS line_geography,
                                    NULL::integer AS signal_id,
                                    NULL::integer AS length_feet
                                FROM
                                    feature_drawn_points
                                WHERE (feature_drawn_points.is_deleted = FALSE)
                            UNION ALL
                            SELECT
                                feature_drawn_lines.id,
                                feature_drawn_lines.component_id,
                                (feature_drawn_lines.geography)::geometry AS geography,
                                (feature_drawn_lines.geography)::geometry AS line_geography,
                                NULL::integer AS signal_id,
                                feature_drawn_lines.length_feet
                            FROM
                                feature_drawn_lines
                            WHERE (feature_drawn_lines.is_deleted = FALSE)) feature_union
                    GROUP BY
                        feature_union.component_id) comp_geography ON ((comp_geography.project_component_id = mpc.project_component_id)))
                LEFT JOIN (
                    SELECT
                        features.component_id AS project_component_id,
                        string_agg(DISTINCT (features_council_districts.council_district_id)::text, ', '::text) AS council_districts
                    FROM (features_council_districts
                        LEFT JOIN features ON ((features.id = features_council_districts.feature_id)))
                WHERE (features.is_deleted = FALSE)
            GROUP BY
                features.component_id) council_districts ON ((council_districts.project_component_id = mpc.project_component_id)))
        LEFT JOIN (
            SELECT
                mpcs.project_component_id,
                string_agg(ms.subcomponent_name, ', '::text) AS subcomponents
            FROM (moped_proj_components_subcomponents mpcs
                LEFT JOIN moped_subcomponents ms ON ((mpcs.subcomponent_id = ms.subcomponent_id)))
        GROUP BY
            mpcs.project_component_id) subcomponents ON ((subcomponents.project_component_id = mpc.project_component_id)))
    LEFT JOIN (
        SELECT
            mpcwt.project_component_id,
            string_agg(mwt.name, ', '::text) AS work_types
        FROM (moped_proj_component_work_types mpcwt
            LEFT JOIN moped_work_types mwt ON ((mpcwt.work_type_id = mwt.id)))
    GROUP BY
        mpcwt.project_component_id) work_types ON ((work_types.project_component_id = mpc.project_component_id)))
    LEFT JOIN (
        SELECT
            mpct.project_component_id,
            string_agg(((mct.type || ' - '::text) || mct.name), ', '::text) AS component_tags
        FROM (moped_proj_component_tags mpct
            LEFT JOIN moped_component_tags mct ON ((mpct.component_tag_id = mct.id)))
    GROUP BY
        mpct.project_component_id) component_tags ON ((component_tags.project_component_id = mpc.project_component_id)))
    LEFT JOIN project_list_view plv ON ((plv.project_id = mpc.project_id)))
    LEFT JOIN current_phase_view current_phase ON ((mpc.project_id = current_phase.project_id)))
    LEFT JOIN moped_phases mph ON ((mpc.phase_id = mph.phase_id)))
    LEFT JOIN moped_components mc ON ((mc.component_id = mpc.component_id)))
WHERE ((mpc.is_deleted = FALSE)
    AND(plv.is_deleted = FALSE))
);
