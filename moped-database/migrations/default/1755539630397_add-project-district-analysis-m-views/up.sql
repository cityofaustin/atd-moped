CREATE VIEW council_district_project_distribution_analytics
AS
WITH point_line_intersections AS (
    SELECT
        projects.project_id,
        districts.council_district,
        ST_INTERSECTION(
            projects.geography, districts.geography
        ) AS intersection_geog,
        ST_GEOMETRYTYPE(projects.geography::geometry) AS source_geom_type
    FROM
        project_geography AS projects
    INNER JOIN
        layer_council_district AS districts
        ON ST_INTERSECTS(
                projects.geography, districts.geography
            )
    WHERE
        ST_GEOMETRYTYPE(projects.geography::geometry) IN (
            'ST_MultiPoint', 'ST_MultiLineString'
        )
),

point_line_district_aggregates AS (
    SELECT
        point_line_intersections.project_id,
        point_line_intersections.council_district AS council_district_id,
        COALESCE(SUM(
            CASE
                WHEN point_line_intersections.source_geom_type = 'ST_MultiPoint'
                    THEN
                        ST_NPOINTS(
                            point_line_intersections.intersection_geog::geometry
                        )
                ELSE 0
            END
        ), 0) AS point_count,
        COALESCE(SUM(
            CASE
                WHEN point_line_intersections.source_geom_type = 'ST_MultiLineString'
                    THEN
                        ST_LENGTH(
                            ST_TRANSFORM(
                                point_line_intersections.intersection_geog::geometry,
                                2277
                            )
                        )
                ELSE 0
            END
        ), 0) AS total_line_distance_feet
    FROM
        point_line_intersections
    GROUP BY
        point_line_intersections.project_id,
        point_line_intersections.council_district
),

area_settings AS (
    SELECT 33 AS buffer_distance
),

area_project_buffers AS (
    SELECT
        projects.project_id,
        ST_BUFFER(
            ST_TRANSFORM(projects.geography::geometry, 2277),
            (SELECT s.buffer_distance FROM area_settings AS s)
        ) AS buffer_geom
    FROM
        project_geography AS projects
    WHERE
        ST_GEOMETRYTYPE(projects.geography::geometry) IN (
            'ST_MultiPoint', 'ST_MultiLineString'
        )
),

area_intersections AS (
    SELECT
        project_buffers.project_id,
        districts.council_district,
        ST_INTERSECTION(
            project_buffers.buffer_geom,
            ST_TRANSFORM(districts.geography::geometry, 2277)
        ) AS intersection_geom
    FROM
        area_project_buffers AS project_buffers
    INNER JOIN
        layer_council_district AS districts
        ON ST_INTERSECTS(
                project_buffers.buffer_geom,
                ST_TRANSFORM(districts.geography::geometry, 2277)
            )
),

area_district_aggregates AS (
    SELECT
        area_intersections.project_id,
        area_intersections.council_district AS council_district_id,
        SUM(
            ST_AREA(area_intersections.intersection_geom)
        ) AS total_area_in_district_sq_ft
    FROM
        area_intersections
    GROUP BY
        area_intersections.project_id,
        area_intersections.council_district
),

combined_district_aggregates AS (
    SELECT
        pl.point_count,
        pl.total_line_distance_feet,
        a.total_area_in_district_sq_ft,
        COALESCE(pl.project_id, a.project_id) AS project_id,
        COALESCE(pl.council_district_id, a.council_district_id) AS council_district_id
    FROM point_line_district_aggregates AS pl
    FULL OUTER JOIN area_district_aggregates AS a
        ON pl.project_id = a.project_id
            AND pl.council_district_id = a.council_district_id
),

project_totals AS (
    SELECT
        project_id,
        SUM(point_count) AS total_points,
        SUM(total_line_distance_feet) AS total_line_distance,
        SUM(total_area_in_district_sq_ft) AS total_area
    FROM combined_district_aggregates
    GROUP BY project_id
)

SELECT
    c.project_id,
    c.council_district_id,
    NULLIF(c.point_count, 0) AS point_count,
    ROUND(NULLIF(c.total_line_distance_feet, 0)::numeric, 2) AS total_line_distance_feet,
    ROUND(c.total_area_in_district_sq_ft::numeric, 2) AS area_in_district_sq_ft,
    ROUND(pt.total_area::numeric, 2) AS total_project_area_sq_ft,
    ROUND((pt.total_area / (5280 * 5280))::numeric, 4) AS total_project_area_sq_mi,
    ROUND((c.point_count * 100.0 / NULLIF(pt.total_points, 0))::numeric, 2) AS point_percentage,
    ROUND((c.total_line_distance_feet * 100.0 / NULLIF(pt.total_line_distance, 0))::numeric, 2) AS line_percentage,
    ROUND((c.total_area_in_district_sq_ft * 100 / NULLIF(pt.total_area, 0))::numeric, 2) AS percentage_of_total_area
FROM
    combined_district_aggregates AS c
INNER JOIN
    project_totals AS pt ON c.project_id = pt.project_id
ORDER BY
    c.project_id,
    c.council_district_id;
