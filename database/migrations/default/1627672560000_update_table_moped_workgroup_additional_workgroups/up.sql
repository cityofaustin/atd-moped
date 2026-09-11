/*
 INSERTS NEW VALUES FOR THE WORKGROUP TABLE
*/
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, department_id) VALUES ('Urban Trails', 19, 3);
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, department_id) VALUES ('Safe Routes to School', 20, 3);
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, department_id) VALUES ('Corridor Program Office', 21, 2);
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, department_id) VALUES ('Sidewalks', 22, 3);
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, department_id) VALUES ('Engineering Services Division', 23, 3);

-- Other already exists, we are going to update its department
UPDATE public.moped_workgroup
    SET department_id = 4
        WHERE workgroup_id = 18   -- Other
;
