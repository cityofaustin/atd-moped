-- Most recent migration: moped-database/migrations/default/1755539630397_add-project-district-analysis-m-views/up.sql

CREATE OR REPLACE VIEW council_district_project_distribution_analytics AS WITH area_project_buffers AS (
    SELECT
        projects.project_id,
        st_buffer(st_transform(projects.geography::geometry, 2277), 100::double precision) AS buffer_geom
    FROM project_geography AS projects
    WHERE st_geometrytype(projects.geography::geometry) = any(ARRAY['ST_MultiPoint'::text, 'ST_MultiLineString'::text])
),

dissolved_project_buffers AS (
    SELECT
        area_project_buffers.project_id,
        st_unaryunion(st_collect(area_project_buffers.buffer_geom)) AS dissolved_buffer_geom
    FROM area_project_buffers
    GROUP BY area_project_buffers.project_id
),

area_district_aggregates AS (
    SELECT
        project_buffers.project_id,
        districts.council_district AS council_district_id,
        sum(st_area(st_intersection(project_buffers.dissolved_buffer_geom, st_transform(districts.geography::geometry, 2277)))) AS total_area_in_district_sq_ft
    FROM dissolved_project_buffers AS project_buffers
    INNER JOIN layer_council_district AS districts ON st_intersects(project_buffers.dissolved_buffer_geom, st_transform(districts.geography::geometry, 2277))
    GROUP BY project_buffers.project_id, districts.council_district
),

project_totals AS (
    SELECT
        area_district_aggregates.project_id,
        sum(area_district_aggregates.total_area_in_district_sq_ft) AS total_area
    FROM area_district_aggregates
    GROUP BY area_district_aggregates.project_id
)

SELECT
    ada.project_id,
    ada.council_district_id AS district_id,
    round((ada.total_area_in_district_sq_ft * 100::double precision / nullif(pt.total_area, 0::double precision))::numeric, 2) AS percentage_of_total
FROM area_district_aggregates AS ada
INNER JOIN project_totals AS pt ON ada.project_id = pt.project_id
ORDER BY ada.project_id, ada.council_district_id;
