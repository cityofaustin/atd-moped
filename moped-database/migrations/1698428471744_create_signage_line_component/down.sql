-- delete component (will cascade to component_work_types)
DELETE from public.moped_components WHERE
        moped_components.component_name = 'Signage'
        AND moped_components.component_subtype = 'linear';
