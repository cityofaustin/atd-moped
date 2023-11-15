DELETE FROM public.moped_component_tags
    WHERE slug in('map_ped_crossing_2024', 'ped_crossing_priority_all', 'bikeways_work_plan_2024');

ALTER TABLE moped_component_tags DROP CONSTRAINT moped_component_tags_name_key;
ALTER TABLE public.moped_component_tags add constraint moped_component_tags_name_key UNIQUE ("name");
