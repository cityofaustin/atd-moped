-- Delete added moped_components records
DELETE FROM public.moped_components WHERE component_name = 'Intersection' AND component_subtype = 'Improvement (linear)';
DELETE FROM public.moped_components WHERE component_name = 'Intersection' AND component_subtype = 'Improvement';
