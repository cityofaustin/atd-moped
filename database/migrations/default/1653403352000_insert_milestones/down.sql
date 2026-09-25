-- Reset milestone_order based on milestone_id
UPDATE public.moped_milestones SET milestone_order = 1 WHERE milestone_id = 1;
UPDATE public.moped_milestones SET milestone_order = 2 WHERE milestone_id = 2;
UPDATE public.moped_milestones SET milestone_order = 3 WHERE milestone_id = 3;
UPDATE public.moped_milestones SET milestone_order = 4 WHERE milestone_id = 4;
UPDATE public.moped_milestones SET milestone_order = 5 WHERE milestone_id = 5;
UPDATE public.moped_milestones SET milestone_order = 6 WHERE milestone_id = 6;
UPDATE public.moped_milestones SET milestone_order = 7 WHERE milestone_id = 7;
UPDATE public.moped_milestones SET milestone_order = 8 WHERE milestone_id = 8;
UPDATE public.moped_milestones SET milestone_order = 9 WHERE milestone_id = 9;
UPDATE public.moped_milestones SET milestone_order = 10 WHERE milestone_id = 10;
UPDATE public.moped_milestones SET milestone_order = 11 WHERE milestone_id = 11;
UPDATE public.moped_milestones SET milestone_order = 12 WHERE milestone_id = 12;
UPDATE public.moped_milestones SET milestone_order = 13 WHERE milestone_id = 13;
UPDATE public.moped_milestones SET milestone_order = 14 WHERE milestone_id = 14;
UPDATE public.moped_milestones SET milestone_order = 15 WHERE milestone_id = 15;
UPDATE public.moped_milestones SET milestone_order = 16 WHERE milestone_id = 16;
UPDATE public.moped_milestones SET milestone_order = 17 WHERE milestone_id = 17;
UPDATE public.moped_milestones SET milestone_order = 18 WHERE milestone_id = 18;
UPDATE public.moped_milestones SET milestone_order = 19 WHERE milestone_id = 19;
UPDATE public.moped_milestones SET milestone_order = 20 WHERE milestone_id = 20;
UPDATE public.moped_milestones SET milestone_order = 21 WHERE milestone_id = 21;
UPDATE public.moped_milestones SET milestone_order = 22 WHERE milestone_id = 22;
UPDATE public.moped_milestones SET milestone_order = 23 WHERE milestone_id = 23;
UPDATE public.moped_milestones SET milestone_order = 24 WHERE milestone_id = 24;
UPDATE public.moped_milestones SET milestone_order = 25 WHERE milestone_id = 25;
UPDATE public.moped_milestones SET milestone_order = 26 WHERE milestone_id = 26;
UPDATE public.moped_milestones SET milestone_order = 27 WHERE milestone_id = 27;
UPDATE public.moped_milestones SET milestone_order = 28 WHERE milestone_id = 28;
UPDATE public.moped_milestones SET milestone_order = 29 WHERE milestone_id = 29;
UPDATE public.moped_milestones SET milestone_order = 30 WHERE milestone_id = 30;
UPDATE public.moped_milestones SET milestone_order = 31 WHERE milestone_id = 31;
UPDATE public.moped_milestones SET milestone_order = 32 WHERE milestone_id = 32;
UPDATE public.moped_milestones SET milestone_order = 33 WHERE milestone_id = 33;


-- Delete added moped_milestone records
DELETE FROM public.moped_milestones WHERE milestone_id > 33;

UPDATE moped_milestones SET related_phase_id = NULL where milestone_id = 31;
