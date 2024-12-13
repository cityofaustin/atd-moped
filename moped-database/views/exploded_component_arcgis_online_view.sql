-- Most recent migration: moped-database/migrations/1733184698645_add_comp_work_types/up.sql

CREATE OR REPLACE VIEW exploded_component_arcgis_online_view AS SELECT
    component_arcgis_online_view.project_id,
    component_arcgis_online_view.project_component_id,
    st_geometrytype(dump.geom) AS geometry_type,
    dump.path[1] AS point_index,
    component_arcgis_online_view.geometry AS original_geometry,
    st_asgeojson(dump.geom) AS exploded_geometry,
    component_arcgis_online_view.project_updated_at
FROM component_arcgis_online_view,
    LATERAL st_dump(st_geomfromgeojson(component_arcgis_online_view.geometry)) dump (path, geom)
WHERE st_geometrytype(st_geomfromgeojson(component_arcgis_online_view.geometry)) = 'ST_MultiPoint'::text;
