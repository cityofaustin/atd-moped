UPDATE
    moped_proj_components
SET
    location_description =  null
FROM (
    SELECT
        component_id AS project_component_id,
        attributes -> 'location_name'::text AS location_description
    FROM
        project_geography
    WHERE
        "table" = 'feature_signals') AS locations
WHERE
    moped_proj_components.project_component_id = locations.project_component_id;
