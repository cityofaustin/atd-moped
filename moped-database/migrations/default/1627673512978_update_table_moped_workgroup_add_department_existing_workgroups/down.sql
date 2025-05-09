/*
 DISASSOCIATE THE DEPARTMENT ID FOR ANY EXISTING RECORDS
*/
UPDATE public.moped_workgroup
    SET department_id = NULL
    WHERE workgroup_id < 19;
