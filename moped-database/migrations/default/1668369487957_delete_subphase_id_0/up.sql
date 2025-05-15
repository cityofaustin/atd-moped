UPDATE public.moped_proj_phases set subphase_id = null where subphase_id = 0;
DELETE from public.moped_subphases where subphase_id = 0;
