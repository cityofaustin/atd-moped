-- see also moped-database/migrations/1696964354076_update-council-district-trigger
DELETE FROM features_council_districts WHERE 1 = 1;

WITH features_union AS (
    SELECT
        id,
        geography
    FROM
        feature_signals
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_intersections
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_drawn_points
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_street_segments
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_drawn_lines
) INSERT INTO features_council_districts (feature_id, council_district_id) (
        SELECT
            features_union.id AS feature_id,
            districts.council_district AS council_district_id
        FROM
            features_union
        LEFT JOIN layer_council_district AS districts ON ST_Distance(districts.geography, features_union.geography, TRUE) < 33
    WHERE
        districts.council_district IS NOT NULL);
