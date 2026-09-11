DELETE FROM public.moped_component_work_types
WHERE work_type_id = (
        SELECT id FROM moped_work_types WHERE key = 'lane_conversion'
    )
    AND component_id IN (
        SELECT component_id
        FROM moped_components
        WHERE component_name_full IN ('Project Extent - Generic (linear)', 'Transit - Lane', 'Transit - Managed Lane Access Point', 'Transit - Transit/Bike Lane', 'Transit - Transit Queue Jump')
    );
