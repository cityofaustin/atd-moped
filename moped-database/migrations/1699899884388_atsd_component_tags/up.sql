ALTER TABLE moped_component_tags DROP CONSTRAINT moped_component_tags_name_key;
ALTER TABLE public.moped_component_tags add constraint moped_component_tags_name_key UNIQUE ("name", "type");

INSERT INTO public.moped_component_tags (name, "type", slug)
        values
        ( '2024', 'MAP Ped Crossing', 'map_ped_crossing_2024'),
        ('All', 'Ped Crossing Priority', 'ped_crossing_priority_all'),
        ('2024', 'Bikeways - Work Plan', 'bikeways_work_plan_2024');
