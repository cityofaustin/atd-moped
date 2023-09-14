UPDATE
    moped_proj_components
SET
    location_description = locations.location_description
FROM (
    SELECT
        component_id AS project_component_id,
        attributes ->> 'signal_id' || ': ' || trim(attributes ->> 'location_name') AS location_description
    FROM
        project_geography
    WHERE
        "table" = 'feature_signals') AS locations
WHERE
    moped_proj_components.project_component_id = locations.project_component_id;
