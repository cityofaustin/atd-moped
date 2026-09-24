DELETE FROM public.moped_component_tags WHERE slug IN ('map_bikeways_2025', 'map_ped_crossing');
DELETE FROM public.moped_tags WHERE slug = 'map_ped_crossing';
