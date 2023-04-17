-- latest version 1678894870998_remove_cols_from_geo_views
DROP VIEW "public"."uniform_features";

CREATE OR REPLACE VIEW "public"."uniform_features" AS
SELECT
    feature_signals.id,
    feature_signals.component_id,
    'feature_signals'::text AS "table",
    json_build_object(
        'signal_id', feature_signals.signal_id, 'knack_id', feature_signals.knack_id, 'location_name', feature_signals.location_name, 'signal_type', feature_signals.signal_type) AS attributes,
    feature_signals.geography
FROM
    feature_signals
WHERE (
    feature_signals.is_deleted = FALSE)
UNION ALL
SELECT
    feature_street_segments.id,
    feature_street_segments.component_id,
    'feature_street_segments'::text AS "table",
    json_build_object(
        'ctn_segment_id', feature_street_segments.ctn_segment_id, 'from_address_min', feature_street_segments.from_address_min, 'to_address_max', feature_street_segments.to_address_max, 'full_street_name', feature_street_segments.full_street_name, 'line_type', feature_street_segments.line_type, 'symbol', feature_street_segments.symbol, 'source_layer', feature_street_segments.source_layer) AS attributes,
    feature_street_segments.geography
FROM
    feature_street_segments
WHERE (
    feature_street_segments.is_deleted = FALSE)
UNION ALL
SELECT
    feature_intersections.id,
    feature_intersections.component_id,
    'feature_intersections'::text AS "table",
    json_build_object(
        'intersection_id', feature_intersections.intersection_id, 'source_layer', feature_intersections.source_layer) AS attributes,
    feature_intersections.geography
FROM
    feature_intersections
WHERE (
    feature_intersections.is_deleted = FALSE)
UNION ALL
SELECT
    feature_drawn_points.id,
    feature_drawn_points.component_id,
    'feature_drawn_points'::text AS "table",
    NULL::json AS attributes,
    feature_drawn_points.geography
FROM
    feature_drawn_points
WHERE (
    feature_drawn_points.is_deleted = FALSE)
UNION ALL
SELECT
    feature_drawn_lines.id,
    feature_drawn_lines.component_id,
    'feature_drawn_lines'::text AS "table",
    NULL::json AS attributes,
    feature_drawn_lines.geography
FROM
    feature_drawn_lines
WHERE (
    feature_drawn_lines.is_deleted = FALSE
);
