-- reset component id sequence to max component ID
SELECT
    setval('moped_components_component_id_seq', (
            SELECT
                max(component_id)
                FROM moped_components));

-- create new component
INSERT INTO public.moped_components (
        component_name,
        component_subtype,
        line_representation,
        feature_layer_id
    ) VALUES
    ('Signage', 'Linear', TRUE, 4 );

-- assign available work types to it
WITH inserts_todo AS (
    SELECT
        id AS work_type_id,
        component_id
    FROM (
        values('new'),
            ('modification'),
            ('maintenance_repair')) AS data (work_type_key)
        LEFT JOIN moped_components ON TRUE
        LEFT JOIN moped_work_types mwt ON data.work_type_key = mwt.key
    WHERE
        moped_components.component_name = 'Signage'
        AND moped_components.component_subtype = 'linear'
) INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    *
FROM
    inserts_todo;
