CREATE VIEW council_district_project_distribution_analytics
AS
WITH area_project_buffers AS (
    SELECT
        projects.project_id,
        ST_BUFFER(
            ST_TRANSFORM(projects.geography::geometry, 2277),
            33
        ) AS buffer_geom
    FROM
        project_geography AS projects
    WHERE
        ST_GEOMETRYTYPE(projects.geography::geometry) IN (
            'ST_MultiPoint', 'ST_MultiLineString'
        )
),

area_district_aggregates AS (
    SELECT
        project_buffers.project_id,
        districts.council_district AS council_district_id,
        SUM(
            ST_AREA(
                ST_INTERSECTION(
                    project_buffers.buffer_geom,
                    ST_TRANSFORM(districts.geography::geometry, 2277)
                )
            )
        ) AS total_area_in_district_sq_ft
    FROM
        area_project_buffers AS project_buffers
    INNER JOIN
        layer_council_district AS districts
        ON ST_INTERSECTS(
                project_buffers.buffer_geom,
                ST_TRANSFORM(districts.geography::geometry, 2277)
            )
    GROUP BY
        project_buffers.project_id,
        districts.council_district
),

project_totals AS (
    SELECT
        project_id,
        SUM(total_area_in_district_sq_ft) AS total_area
    FROM area_district_aggregates
    GROUP BY project_id
)

SELECT
    ada.project_id,
    ada.council_district_id AS district_id,
    ROUND((ada.total_area_in_district_sq_ft * 100 / NULLIF(pt.total_area, 0))::numeric, 2) AS percentage_of_total
FROM
    area_district_aggregates AS ada
INNER JOIN
    project_totals AS pt ON ada.project_id = pt.project_id
ORDER BY
    ada.project_id,
    ada.council_district_id;
