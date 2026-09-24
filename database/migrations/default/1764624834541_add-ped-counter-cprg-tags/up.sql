-- add bike/ped counter component type (point) to moped_components table if it doesn't already exist
INSERT INTO moped_components (component_name, component_subtype, line_representation, feature_layer_id)
SELECT
    'Counter',
    'Bike/Ped',
    FALSE,
    5
WHERE NOT EXISTS (
        SELECT *
        FROM
            moped_components
        WHERE (component_name, component_subtype, line_representation, feature_layer_id) = ('Counter', 'Bike/Ped', FALSE, 5)
    );

-- insert new, mod, and replacement work types for bike share station in moped_component_work_types table
WITH inserts_todo AS (
    SELECT
        mwt.id AS work_type_id,
        mc.component_id
    FROM
        moped_work_types AS mwt,
        moped_components AS mc
    WHERE
        mwt.key IN (
            'new',
            'modification',
            'maintenance_repair'
        )
        AND mc.component_name = 'Counter'
)

INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    work_type_id,
    component_id
FROM
    inserts_todo
ON CONFLICT DO NOTHING;


INSERT INTO moped_tags (type, name, slug) VALUES
('Work Plan', 'CPRG 2025', 'cprg_2025'),
('Work Plan', 'CPRG 2026', 'cprg_2026'),
('Work Plan', 'CPRG 2027', 'cprg_2027'),
('Work Plan', 'CPRG 2028', 'cprg_2028'),
('Work Plan', 'CPRG 2029', 'cprg_2029');
