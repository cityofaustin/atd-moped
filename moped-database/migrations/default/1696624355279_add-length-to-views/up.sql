DROP VIEW "public"."project_geography";
DROP VIEW "public"."uniform_features";
CREATE VIEW "public"."uniform_features" AS
SELECT
    feature_signals.id,
    feature_signals.component_id,
    'feature_signals'::text AS "table",
    json_build_object('signal_id', feature_signals.signal_id, 'knack_id', feature_signals.knack_id, 'location_name', feature_signals.location_name, 'signal_type', feature_signals.signal_type) AS attributes,
    feature_signals.geography,
    districts.council_districts,
    NULL as length_feet
FROM
    feature_signals
    LEFT JOIN (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM
            features_council_districts d
        GROUP BY
            d.feature_id) districts ON districts.feature_id = feature_signals.id
WHERE (feature_signals.is_deleted = FALSE)
UNION ALL
SELECT
    feature_street_segments.id,
    feature_street_segments.component_id,
    'feature_street_segments'::text AS "table",
    json_build_object('ctn_segment_id', feature_street_segments.ctn_segment_id, 'from_address_min', feature_street_segments.from_address_min, 'to_address_max', feature_street_segments.to_address_max, 'full_street_name', feature_street_segments.full_street_name, 'line_type', feature_street_segments.line_type, 'symbol', feature_street_segments.symbol, 'source_layer', feature_street_segments.source_layer) AS attributes,
    feature_street_segments.geography,
    districts.council_districts,
    feature_street_segments.length_feet
FROM
    feature_street_segments
    LEFT JOIN (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM
            features_council_districts d
        GROUP BY
            d.feature_id) districts ON districts.feature_id = feature_street_segments.id
WHERE (feature_street_segments.is_deleted = FALSE)
UNION ALL
SELECT
    feature_intersections.id,
    feature_intersections.component_id,
    'feature_intersections'::text AS "table",
    json_build_object('intersection_id', feature_intersections.intersection_id, 'source_layer', feature_intersections.source_layer) AS attributes,
    feature_intersections.geography,
    districts.council_districts,
    NULL as length_feet
FROM
    feature_intersections
    LEFT JOIN (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM
            features_council_districts d
        GROUP BY
            d.feature_id) districts ON districts.feature_id = feature_intersections.id
WHERE (feature_intersections.is_deleted = FALSE)
UNION ALL
SELECT
    feature_drawn_points.id,
    feature_drawn_points.component_id,
    'feature_drawn_points'::text AS "table",
    NULL::json AS attributes,
    feature_drawn_points.geography,
    districts.council_districts,
    NULL as length_feet
FROM
    feature_drawn_points
    LEFT JOIN (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM
            features_council_districts d
        GROUP BY
            d.feature_id) districts ON districts.feature_id = feature_drawn_points.id
WHERE (feature_drawn_points.is_deleted = FALSE)
UNION ALL
SELECT
    feature_drawn_lines.id,
    feature_drawn_lines.component_id,
    'feature_drawn_lines'::text AS "table",
    NULL::json as attributes,
    feature_drawn_lines.geography,
    districts.council_districts,
    feature_drawn_lines.length_feet
FROM
    feature_drawn_lines
    LEFT JOIN (
        SELECT
            d.feature_id,
            array_agg(d.council_district_id) AS council_districts
        FROM
            features_council_districts d
        GROUP BY
            d.feature_id) districts ON districts.feature_id = feature_drawn_lines.id
WHERE (feature_drawn_lines.is_deleted = FALSE);

CREATE VIEW "public"."project_geography" AS
SELECT
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
  uniform_features.length_feet
FROM
  (
    (
      (
        (
          moped_project
          JOIN moped_proj_components ON (
            (
              moped_proj_components.project_id = moped_project.project_id
            )
          )
        )
        JOIN moped_components ON (
          (
            moped_proj_components.component_id = moped_components.component_id
          )
        )
      )
      JOIN feature_layers ON (
        (
          moped_components.feature_layer_id = feature_layers.id
        )
      )
    )
    JOIN uniform_features ON (
      (
        moped_proj_components.project_component_id = uniform_features.component_id
      )
    )
  );
