/*
    UPDATES ALL EXISTING VALUES IN WORKGROUP TABLE
*/
UPDATE public.moped_workgroup
    SET department_id = 1
    WHERE workgroup_id < 19;
