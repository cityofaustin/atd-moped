/*
 DELETES NEW VALUES FOR THE WORKGROUP TABLE
*/

DELETE FROM public.moped_workgroup
    WHERE workgroup_id IN (19,20,21,22,23,24);
