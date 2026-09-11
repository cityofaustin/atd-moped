-- Most recent migration: moped-database/migrations/default/1788304724360_update_exploded_view/up.sql

CREATE OR REPLACE VIEW exploded_component_arcgis_online_view AS
SELECT
    mpc.project_id,
    mpc.project_component_id,
    st_geometrytype(dump.geom) AS geometry_type,
    dump.path[1]               AS point_index,
    comp_geography.geometry    AS original_geometry,
    st_asgeojson(dump.geom)    AS exploded_geometry,
    mp.updated_at              AS project_updated_at
FROM moped_proj_components mpc
LEFT JOIN
    component_geography_view comp_geography
    ON mpc.project_component_id = comp_geography.project_component_id
LEFT JOIN moped_project mp ON mpc.project_id = mp.project_id,
LATERAL st_dump(st_geomfromgeojson(comp_geography.geometry)) dump(path, geom)
WHERE mpc.is_deleted = false AND mp.is_deleted = false AND st_geometrytype(st_geomfromgeojson(comp_geography.geometry)) = 'ST_MultiPoint'::text;
