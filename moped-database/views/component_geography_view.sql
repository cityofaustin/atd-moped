-- Most recent migration: moped-database/migrations/default/1788304724360_update_exploded_view/up.sql

CREATE OR REPLACE VIEW component_geography_view AS
SELECT
    component_id                                                      AS project_component_id,
    string_agg(DISTINCT id::text, ', '::text)                         AS feature_ids,
    st_asgeojson(st_multi(st_union(array_agg(geography))))::json      AS geometry,
    st_asgeojson(st_multi(st_union(array_agg(line_geography))))::json AS line_geometry,
    string_agg(DISTINCT signal_id::text, ', '::text)                  AS signal_ids,
    sum(length_feet)                                                  AS length_feet_total,
    count(id)                                                         AS feature_count
FROM (SELECT
    feature_signals.id,
    feature_signals.component_id,
    feature_signals.geography::geometry AS geography,
    st_exteriorring(
        st_buffer(feature_signals.geography, 7::double precision)::geometry
    )                                   AS line_geography,
    feature_signals.signal_id,
    NULL::integer                       AS length_feet
FROM feature_signals
WHERE feature_signals.is_deleted = FALSE
UNION ALL
SELECT
    feature_street_segments.id,
    feature_street_segments.component_id,
    feature_street_segments.geography::geometry AS geography,
    feature_street_segments.geography::geometry AS line_geography,
    NULL::integer                               AS signal_id,
    feature_street_segments.length_feet
FROM feature_street_segments
WHERE feature_street_segments.is_deleted = FALSE
UNION ALL
SELECT
    feature_intersections.id,
    feature_intersections.component_id,
    feature_intersections.geography::geometry AS geography,
    st_exteriorring(
        st_buffer(feature_intersections.geography, 7::double precision)::geometry
    )                                         AS line_geography,
    NULL::integer                             AS signal_id,
    NULL::integer                             AS length_feet
FROM feature_intersections
WHERE feature_intersections.is_deleted = FALSE
UNION ALL
SELECT
    feature_drawn_points.id,
    feature_drawn_points.component_id,
    feature_drawn_points.geography::geometry AS geography,
    st_exteriorring(
        st_buffer(feature_drawn_points.geography, 7::double precision)::geometry
    )                                        AS line_geography,
    NULL::integer                            AS signal_id,
    NULL::integer                            AS length_feet
FROM feature_drawn_points
WHERE feature_drawn_points.is_deleted = FALSE
UNION ALL
SELECT
    feature_drawn_lines.id,
    feature_drawn_lines.component_id,
    feature_drawn_lines.geography::geometry AS geography,
    feature_drawn_lines.geography::geometry AS line_geography,
    NULL::integer                           AS signal_id,
    feature_drawn_lines.length_feet
FROM feature_drawn_lines
WHERE feature_drawn_lines.is_deleted = FALSE
UNION ALL
SELECT
    feature_school_beacons.id,
    feature_school_beacons.component_id,
    feature_school_beacons.geography::geometry AS geography,
    st_exteriorring(
        st_buffer(feature_school_beacons.geography, 7::double precision)::geometry
    )                                          AS line_geography,
    NULL::integer                              AS signal_id,
    NULL::integer                              AS length_feet
FROM feature_school_beacons
WHERE feature_school_beacons.is_deleted = FALSE) feature_union
GROUP BY component_id;
