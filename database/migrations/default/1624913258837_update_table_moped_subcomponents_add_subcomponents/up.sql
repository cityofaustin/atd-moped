/*
    First, we must update existing subcomponents.
*/
UPDATE public.moped_subcomponents SET subcomponent_name = 'Audible push button', component_id = 16 WHERE subcomponent_id = 1;
UPDATE public.moped_subcomponents SET subcomponent_name = 'Bicycle signal', component_id = 16 WHERE subcomponent_id = 2;
UPDATE public.moped_subcomponents SET subcomponent_name = 'Leading pedestrian interval', component_id = 16 WHERE subcomponent_id = 3;
UPDATE public.moped_subcomponents SET subcomponent_name = 'Audible push button', component_id = 17 WHERE subcomponent_id = 4;

/*
    Then, we can insert the rest of them
*/
INSERT INTO moped_subcomponents (component_id, subcomponent_id, subcomponent_name)
VALUES
    (17, 5, 'Bicycle signal'),
    (17, 6, 'Leading pedestrian interval'),
    (18, 7, 'Audible push button'),
    (18, 8, 'Bicycle signal'),
    (18, 9, 'Leading pedestrian interval'),
    (7, 10, 'Raised pavement markers'),
    (8, 11, 'Raised pavement markers'),
    (9, 12, 'Raised pavement markers'),
    (10, 13, 'Raised pavement markers'),
    (11, 14, 'Raised pavement markers'),
    (12, 15, 'Raised pavement markers'),
    (6, 16, 'Raised pavement markers'),
    (21, 17, 'Raised pavement markers'),
    (22, 18, 'Raised pavement markers')
;
