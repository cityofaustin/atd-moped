-- add bike share station component type (point) to moped_components table if it doesn't already exist
INSERT INTO moped_components (component_name, component_subtype, line_representation, feature_layer_id)
SELECT
    'Signage',
    'All Way Stop',
    FALSE,
    5
WHERE NOT EXISTS (
        SELECT *
        FROM
            moped_components
        WHERE (component_name, component_subtype, line_representation, feature_layer_id) = ('Signage', 'All Way Stop', FALSE, 5)
    );

-- insert new, mod, and replacement work types for bike share station in moped_component_work_types table
WITH inserts_todo AS (
    SELECT
        mwt.id AS work_type_id,
        mc.component_id AS component_id
    FROM
        moped_work_types AS mwt,
        moped_components AS mc
    WHERE
        mwt.name IN (
            'New'
        )
        AND mc.component_name = 'Signage'
        AND mc.component_subtype = 'All Way Stop'
)

INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    work_type_id,
    component_id
FROM
    inserts_todo
ON CONFLICT DO NOTHING;
