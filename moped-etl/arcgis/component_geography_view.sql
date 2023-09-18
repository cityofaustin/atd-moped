-- https://austin.maps.arcgis.com/home/item.html?id=4736ec7436d24d809f327a367adb638e#overview
SELECT
    component_id,
    ARRAY_AGG(id ORDER BY id) AS feature_ids,
    ST_AsGeoJSON(ST_Union(ARRAY_AGG(geography))) AS "geometry",
    NULLIF(ARRAY_AGG(DISTINCT signal_id ORDER BY signal_id), '{NULL}') AS signal_ids,
    NULLIF(ARRAY_AGG(DISTINCT council_district ORDER BY council_district), '{NULL}') AS council_districts
FROM (
    SELECT
        id,
        feature_signals.component_id,
        feature_signals.geography::geometry,
        feature_signals.signal_id,
        council_districts.council_districts
    FROM
        feature_signals
    LEFT JOIN (
        SELECT
            council_districts.feature_id,
            array_agg(council_districts.council_district_id) AS council_districts
        FROM
            features_council_districts council_districts
        GROUP BY
            council_districts.feature_id) council_districts ON ((council_districts.feature_id = feature_signals.id))
    WHERE
        feature_signals.is_deleted = FALSE
    UNION ALL
    SELECT
        id,
        feature_street_segments.component_id,
        feature_street_segments.geography::geometry,
        NULL AS signal_id,
        council_districts.council_districts
    FROM
        feature_street_segments
    LEFT JOIN (
        SELECT
            council_districts.feature_id,
            array_agg(council_districts.council_district_id) AS council_districts
        FROM
            features_council_districts council_districts
        GROUP BY
            council_districts.feature_id) council_districts ON ((council_districts.feature_id = feature_street_segments.id))
    WHERE
        feature_street_segments.is_deleted = FALSE
    UNION ALL
    SELECT
        id,
        feature_intersections.component_id,
        feature_intersections.geography::geometry,
        NULL AS signal_id,
        council_districts.council_districts
    FROM
        feature_intersections
    LEFT JOIN (
        SELECT
            council_districts.feature_id,
            array_agg(council_districts.council_district_id) AS council_districts
        FROM
            features_council_districts council_districts
        GROUP BY
            council_districts.feature_id) council_districts ON ((council_districts.feature_id = feature_intersections.id))
    WHERE
        feature_intersections.is_deleted = FALSE
    UNION ALL
    SELECT
        id,
        feature_drawn_points.component_id,
        feature_drawn_points.geography::geometry,
        NULL AS signal_id,
        council_districts.council_districts
    FROM
        feature_drawn_points
    LEFT JOIN (
        SELECT
            council_districts.feature_id,
            array_agg(council_districts.council_district_id) AS council_districts
        FROM
            features_council_districts council_districts
        GROUP BY
            council_districts.feature_id) council_districts ON ((council_districts.feature_id = feature_drawn_points.id))
    WHERE
        feature_drawn_points.is_deleted = FALSE
    UNION ALL
    SELECT
        id,
        feature_drawn_lines.component_id,
        feature_drawn_lines.geography::geometry,
        NULL AS signal_id,
        council_districts.council_districts
    FROM
        feature_drawn_lines
    LEFT JOIN (
        SELECT
            council_districts.feature_id,
            array_agg(council_districts.council_district_id) AS council_districts
        FROM
            features_council_districts council_districts
        GROUP BY
            council_districts.feature_id) council_districts ON ((council_districts.feature_id = feature_drawn_lines.id))
    WHERE
        feature_drawn_lines.is_deleted = FALSE) AS core, unnest(council_districts) council_district
GROUP BY
    component_id;