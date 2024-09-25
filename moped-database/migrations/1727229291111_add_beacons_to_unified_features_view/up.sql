DROP VIEW IF EXISTS project_geography;
DROP VIEW IF EXISTS uniform_features;

CREATE OR REPLACE VIEW uniform_features
AS SELECT
    feature_signals.id,
    feature_signals.component_id,
    'feature_signals'::text AS "table",
    json_build_object('signal_id', feature_signals.signal_id, 'knack_id', feature_signals.knack_id, 'location_name', feature_signals.location_name, 'signal_type', feature_signals.signal_type) AS attributes,
    feature_signals.geography,
    districts.council_districts,
    NULL::integer AS length_feet,
    feature_signals.created_at,
    feature_signals.updated_at,
    feature_signals.created_by_user_id,
    feature_signals.updated_by_user_id
FROM feature_signals LEFT JOIN
    (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM features_council_districts AS d
        GROUP BY d.feature_id
    ) AS districts ON feature_signals.id = districts.feature_id
WHERE feature_signals.is_deleted = FALSE
UNION ALL
SELECT
    feature_street_segments.id,
    feature_street_segments.component_id,
    'feature_street_segments'::text AS "table",
    json_build_object('ctn_segment_id', feature_street_segments.ctn_segment_id, 'from_address_min', feature_street_segments.from_address_min, 'to_address_max', feature_street_segments.to_address_max, 'full_street_name', feature_street_segments.full_street_name, 'line_type', feature_street_segments.line_type, 'symbol', feature_street_segments.symbol, 'source_layer', feature_street_segments.source_layer) AS attributes,
    feature_street_segments.geography,
    districts.council_districts,
    feature_street_segments.length_feet,
    feature_street_segments.created_at,
    feature_street_segments.updated_at,
    feature_street_segments.created_by_user_id,
    feature_street_segments.updated_by_user_id
FROM feature_street_segments
LEFT JOIN (
    SELECT
        d.feature_id,
        array_agg(d.council_district_id) AS council_districts
    FROM features_council_districts AS d
    GROUP BY d.feature_id
) AS districts ON feature_street_segments.id = districts.feature_id
WHERE feature_street_segments.is_deleted = FALSE
UNION ALL
SELECT
    feature_intersections.id,
    feature_intersections.component_id,
    'feature_intersections'::text AS "table",
    json_build_object('intersection_id', feature_intersections.intersection_id, 'source_layer', feature_intersections.source_layer) AS attributes,
    feature_intersections.geography,
    districts.council_districts,
    NULL::integer AS length_feet,
    feature_intersections.created_at,
    feature_intersections.updated_at,
    feature_intersections.created_by_user_id,
    feature_intersections.updated_by_user_id
FROM feature_intersections
LEFT JOIN (
    SELECT
        d.feature_id,
        array_agg(d.council_district_id) AS council_districts
    FROM features_council_districts AS d
    GROUP BY d.feature_id
) AS districts ON feature_intersections.id = districts.feature_id
WHERE feature_intersections.is_deleted = FALSE
UNION ALL
SELECT
    feature_drawn_points.id,
    feature_drawn_points.component_id,
    'feature_drawn_points'::text AS "table",
    NULL::json AS attributes,
    feature_drawn_points.geography,
    districts.council_districts,
    NULL::integer AS length_feet,
    feature_drawn_points.created_at,
    feature_drawn_points.updated_at,
    feature_drawn_points.created_by_user_id,
    feature_drawn_points.updated_by_user_id
FROM feature_drawn_points
LEFT JOIN (
    SELECT
        d.feature_id,
        array_agg(d.council_district_id) AS council_districts
    FROM features_council_districts AS d
    GROUP BY d.feature_id
) AS districts ON feature_drawn_points.id = districts.feature_id
WHERE feature_drawn_points.is_deleted = FALSE
UNION ALL
SELECT
    feature_drawn_lines.id,
    feature_drawn_lines.component_id,
    'feature_drawn_lines'::text AS "table",
    NULL::json AS attributes,
    feature_drawn_lines.geography,
    districts.council_districts,
    feature_drawn_lines.length_feet,
    feature_drawn_lines.created_at,
    feature_drawn_lines.updated_at,
    feature_drawn_lines.created_by_user_id,
    feature_drawn_lines.updated_by_user_id
FROM feature_drawn_lines
LEFT JOIN (
    SELECT
        d.feature_id,
        array_agg(d.council_district_id) AS council_districts
    FROM features_council_districts AS d
    GROUP BY d.feature_id
) AS districts ON feature_drawn_lines.id = districts.feature_id
WHERE feature_drawn_lines.is_deleted = FALSE
UNION ALL
SELECT -- update this chiaaaaaaaaa
    feature_school_beacons.id,
    feature_school_beacons.component_id,
    'feature_school_beacons'::text AS "table",
    json_build_object('school_zone_beacon_id', feature_school_beacons.school_zone_beacon_id, 'knack_id', feature_school_beacons.knack_id, 'location_name', feature_school_beacons.location_name, 'zone_name', feature_school_beacons.zone_name, 'beacon_name', feature_school_beacons.beacon_name) AS attributes,
    feature_school_beacons.geography,
    districts.council_districts,
    NULL::integer AS length_feet,
    feature_school_beacons.created_at,
    feature_school_beacons.updated_at,
    feature_school_beacons.created_by_user_id,
    feature_school_beacons.updated_by_user_id
FROM feature_school_beacons LEFT JOIN
    (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM features_council_districts AS d
        GROUP BY d.feature_id
    ) AS districts ON feature_school_beacons.id = districts.feature_id
WHERE feature_school_beacons.is_deleted = FALSE;

COMMENT ON VIEW uniform_features IS 'This view unifies various geographical feature data from multiple tables such as signals, street segments, intersections, drawn points, and lines. It provides a view of these features along with their attributes, geographic details, and council district associations.';

CREATE OR REPLACE VIEW public.project_geography
AS SELECT
    moped_project.project_id,
    uniform_features.id AS feature_id,
    moped_components.component_id AS component_archtype_id,
    moped_proj_components.project_component_id AS component_id,
    moped_proj_components.is_deleted,
    moped_project.project_name,
    feature_layers.internal_table AS "table",
    feature_layers.reference_layer_primary_key_column AS original_fk,
    moped_components.component_name,
    uniform_features.attributes,
    uniform_features.geography,
    uniform_features.council_districts,
    uniform_features.length_feet,
    uniform_features.created_at AS feature_created_at,
    uniform_features.updated_at AS feature_updated_at,
    uniform_features.created_by_user_id AS feature_created_by_user_id,
    uniform_features.updated_by_user_id AS feature_updated_by_user_id
FROM moped_project
INNER JOIN moped_proj_components ON moped_project.project_id = moped_proj_components.project_id
INNER JOIN moped_components ON moped_proj_components.component_id = moped_components.component_id
INNER JOIN feature_layers ON moped_components.feature_layer_id = feature_layers.id
INNER JOIN uniform_features ON moped_proj_components.project_component_id = uniform_features.component_id;

COMMENT ON VIEW public.project_geography IS 'The project_geography view merges project-specific data with the unified geographical features from the uniform_features view. It links projects with their respective geographical components, including type, attributes, and location.';
