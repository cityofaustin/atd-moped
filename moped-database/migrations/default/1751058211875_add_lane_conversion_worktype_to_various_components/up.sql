INSERT INTO public.moped_component_work_types (component_id, work_type_id)
SELECT
    moped_components.component_id,
    moped_work_types.id
FROM moped_components, moped_work_types
WHERE moped_components.component_name_full IN ('Project Extent - Generic (linear)', 'Transit - Lane', 'Transit - Managed Lane Access Point', 'Transit - Transit/Bike Lane', 'Transit - Transit Queue Jump')
    AND moped_work_types.key = 'lane_conversion';
