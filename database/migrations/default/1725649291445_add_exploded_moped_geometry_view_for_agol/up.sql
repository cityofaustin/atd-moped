CREATE VIEW exploded_component_arcgis_online_view AS
SELECT
    component_arcgis_online_view.project_id,
    component_arcgis_online_view.project_component_id,
    ST_GEOMETRYTYPE(dump.geom) AS geometry_type,
    dump.path[1] AS point_index, -- ordinal value of the point in the MultiPoint geometry
    component_arcgis_online_view.geometry AS original_geometry,
    ST_ASGEOJSON(dump.geom) AS exploded_geometry, -- noqa: RF04
    component_arcgis_online_view.project_updated_at
FROM
    component_arcgis_online_view,
    LATERAL ST_DUMP(ST_GEOMFROMGEOJSON(component_arcgis_online_view.geometry)) AS dump -- noqa: RF04
WHERE
    ST_GEOMETRYTYPE(ST_GEOMFROMGEOJSON(component_arcgis_online_view.geometry)) = 'ST_MultiPoint';
