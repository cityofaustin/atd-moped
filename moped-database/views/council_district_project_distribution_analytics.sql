-- Most recent migration: moped-database/migrations/default/1755539630397_add-project-district-analysis-m-views/up.sql

CREATE OR REPLACE VIEW council_district_project_distribution_analytics AS WITH point_line_intersections AS (
    SELECT
        projects.project_id,
        districts.council_district,
        st_intersection(projects.geography, districts.geography) AS intersection_geog,
        st_geometrytype(projects.geography::geometry) AS source_geom_type
    FROM project_geography projects
    JOIN layer_council_district districts ON st_intersects(projects.geography, districts.geography)
    WHERE st_geometrytype(projects.geography::geometry) = any(ARRAY['ST_MultiPoint'::text, 'ST_MultiLineString'::text])
),

point_line_district_aggregates AS (
    SELECT
        point_line_intersections.project_id,
        point_line_intersections.council_district AS council_district_id,
        coalesce(sum(
            CASE
                WHEN point_line_intersections.source_geom_type = 'ST_MultiPoint'::text THEN st_npoints(point_line_intersections.intersection_geog::geometry)
                ELSE 0
            END
        ), 0::bigint) AS point_count,
        coalesce(sum(
            CASE
                WHEN point_line_intersections.source_geom_type = 'ST_MultiLineString'::text THEN st_length(st_transform(point_line_intersections.intersection_geog::geometry, 2277))
                ELSE 0::double precision
            END
        ), 0::double precision) AS total_line_distance_feet
    FROM point_line_intersections
    GROUP BY point_line_intersections.project_id, point_line_intersections.council_district
),

area_settings AS (
    SELECT 33 AS buffer_distance
),

area_project_buffers AS (
    SELECT
        projects.project_id,
        st_buffer(st_transform(projects.geography::geometry, 2277), ((
            SELECT s.buffer_distance
            FROM area_settings s
        ))::double precision) AS buffer_geom
    FROM project_geography projects
    WHERE st_geometrytype(projects.geography::geometry) = any(ARRAY['ST_MultiPoint'::text, 'ST_MultiLineString'::text])
),

area_intersections AS (
    SELECT
        project_buffers.project_id,
        districts.council_district,
        st_intersection(project_buffers.buffer_geom, st_transform(districts.geography::geometry, 2277)) AS intersection_geom
    FROM area_project_buffers project_buffers
    JOIN layer_council_district districts ON st_intersects(project_buffers.buffer_geom, st_transform(districts.geography::geometry, 2277))
),

area_district_aggregates AS (
    SELECT
        area_intersections.project_id,
        area_intersections.council_district AS council_district_id,
        sum(st_area(area_intersections.intersection_geom)) AS total_area_in_district_sq_ft
    FROM area_intersections
    GROUP BY area_intersections.project_id, area_intersections.council_district
),

combined_district_aggregates AS (
    SELECT
        pl.point_count,
        pl.total_line_distance_feet,
        a.total_area_in_district_sq_ft,
        coalesce(pl.project_id, a.project_id) AS project_id,
        coalesce(pl.council_district_id, a.council_district_id) AS council_district_id
    FROM point_line_district_aggregates pl
    FULL JOIN area_district_aggregates a ON pl.project_id = a.project_id AND pl.council_district_id = a.council_district_id
),

project_totals AS (
    SELECT
        combined_district_aggregates.project_id,
        sum(combined_district_aggregates.point_count) AS total_points,
        sum(combined_district_aggregates.total_line_distance_feet) AS total_line_distance,
        sum(combined_district_aggregates.total_area_in_district_sq_ft) AS total_area
    FROM combined_district_aggregates
    GROUP BY combined_district_aggregates.project_id
)

SELECT
    c.project_id,
    c.council_district_id AS district_id,
    round((c.total_area_in_district_sq_ft * 100::double precision / nullif(pt.total_area, 0::double precision))::numeric, 2) AS percentage_of_total
FROM combined_district_aggregates c
JOIN project_totals pt ON c.project_id = pt.project_id
ORDER BY c.project_id, c.council_district_id;
