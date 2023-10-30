-- delete component (will cascade to component_work_types)
DELETE from public.moped_components WHERE
        moped_components.component_name = 'Signage'
        AND moped_components.component_subtype = 'Linear';

-- reset coponent id sequence
SELECT
    setval('moped_components_component_id_seq', (
            SELECT
                max(component_id)
                FROM moped_components));
