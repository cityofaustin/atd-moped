DROP VIEW IF EXISTS exploded_component_arcgis_online_view;

CREATE OR REPLACE VIEW exploded_component_arcgis_online_view AS
WITH comp_geography AS (
    SELECT
        feature_union.component_id                                                 AS project_component_id,
        string_agg(
            DISTINCT feature_union.id::text, ', '::text
        )                                                                          AS feature_ids,
        st_asgeojson(st_multi(st_union(array_agg(feature_union.geography))))::json AS geometry,
        st_asgeojson(
            st_multi(st_union(array_agg(feature_union.line_geography)))
        )::json                                                                    AS line_geometry,
        string_agg(DISTINCT feature_union.signal_id::text, ', '::text)             AS signal_ids,
        sum(
            feature_union.length_feet
        )                                                                          AS length_feet_total,
        count(feature_union.id)                                                    AS feature_count
    FROM (
        SELECT
            feature_signals.id,
            feature_signals.component_id,
            feature_signals.geography::geometry AS geography,
            st_exteriorring(
                st_buffer(feature_signals.geography, 7::double precision)::geometry
            )                                   AS line_geography,
            feature_signals.signal_id,
            null::integer                       AS length_feet
        FROM feature_signals
        WHERE feature_signals.is_deleted = false
        UNION ALL
        SELECT
            feature_street_segments.id,
            feature_street_segments.component_id,
            feature_street_segments.geography::geometry AS geography,
            feature_street_segments.geography::geometry AS line_geography,
            null::integer                               AS signal_id,
            feature_street_segments.length_feet
        FROM feature_street_segments
        WHERE feature_street_segments.is_deleted = false
        UNION ALL
        SELECT
            feature_intersections.id,
            feature_intersections.component_id,
            feature_intersections.geography::geometry AS geography,
            st_exteriorring(
                st_buffer(feature_intersections.geography, 7::double precision)::geometry
            )                                         AS line_geography,
            null::integer                             AS signal_id,
            null::integer                             AS length_feet
        FROM feature_intersections
        WHERE feature_intersections.is_deleted = false
        UNION ALL
        SELECT
            feature_drawn_points.id,
            feature_drawn_points.component_id,
            feature_drawn_points.geography::geometry AS geography,
            st_exteriorring(
                st_buffer(feature_drawn_points.geography, 7::double precision)::geometry
            )                                        AS line_geography,
            null::integer                            AS signal_id,
            null::integer                            AS length_feet
        FROM feature_drawn_points
        WHERE feature_drawn_points.is_deleted = false
        UNION ALL
        SELECT
            feature_drawn_lines.id,
            feature_drawn_lines.component_id,
            feature_drawn_lines.geography::geometry AS geography,
            feature_drawn_lines.geography::geometry AS line_geography,
            null::integer                           AS signal_id,
            feature_drawn_lines.length_feet
        FROM feature_drawn_lines
        WHERE feature_drawn_lines.is_deleted = false
        UNION ALL
        SELECT
            feature_school_beacons.id,
            feature_school_beacons.component_id,
            feature_school_beacons.geography::geometry AS geography,
            st_exteriorring(
                st_buffer(feature_school_beacons.geography, 7::double precision)::geometry
            )                                          AS line_geography,
            null::integer                              AS signal_id,
            null::integer                              AS length_feet
        FROM feature_school_beacons
        WHERE feature_school_beacons.is_deleted = false
    ) feature_union
    GROUP BY feature_union.component_id
)

SELECT
    mpc.project_id,
    mpc.project_component_id,
    st_geometrytype(dump.geom) AS geometry_type,
    dump.path[1]               AS point_index,
    comp_geography.geometry    AS original_geometry,
    st_asgeojson(dump.geom)    AS exploded_geometry,
    mp.updated_at              AS project_updated_at
FROM moped_proj_components mpc
LEFT JOIN comp_geography ON mpc.project_component_id = comp_geography.project_component_id
LEFT JOIN moped_project mp ON mpc.project_id = mp.project_id
,
LATERAL st_dump (st_geomfromgeojson (comp_geography.geometry)) dump (path, geom)
WHERE mpc.is_deleted = false
AND mp.is_deleted = false
AND st_geometrytype (st_geomfromgeojson (comp_geography.geometry)) = 'ST_MultiPoint'::text;
