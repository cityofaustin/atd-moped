UPDATE public.moped_subcomponents SET subcomponent_name = 'Raised pavement markers', component_id = 1 WHERE subcomponent_id = 1;
UPDATE public.moped_subcomponents SET subcomponent_name = 'Audible push button', component_id = 2 WHERE subcomponent_id = 2;
UPDATE public.moped_subcomponents SET subcomponent_name = 'Bicycle signal', component_id = 3 WHERE subcomponent_id = 3;
UPDATE public.moped_subcomponents SET subcomponent_name = 'Leading pedestrian interval', component_id = 4 WHERE subcomponent_id = 4;

DELETE FROM public.moped_subcomponents WHERE subcomponent_id > 4;
