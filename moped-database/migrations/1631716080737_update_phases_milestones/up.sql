/**
  Phases
 */
UPDATE public.moped_phases SET phase_name = 'Potential', phase_description = 'Project is planned but has yet to move into additional phases', phase_order = 1, phase_average_length = null, required_phase = null, subphases = '{5,11,12,13,14}' WHERE phase_id = 1;
UPDATE public.moped_phases SET phase_name = 'Planned', phase_description = 'Project is planned but has yet to move into additional phases', phase_order = 2, phase_average_length = null, required_phase = null, subphases = '{4,9,15}' WHERE phase_id = 2;
UPDATE public.moped_phases SET phase_name = 'Design', phase_description = 'Project is undergoing a traditional 30%, 60%, 90%, 100% design phase', phase_order = 6, phase_average_length = null, required_phase = null, subphases = '{16,17,18,19}' WHERE phase_id = 6;
UPDATE public.moped_phases SET phase_name = 'Construction-ready', phase_description = 'Project is ready for construction pending schedules, work orders, etc', phase_order = 9, phase_average_length = null, required_phase = null, subphases = null WHERE phase_id = 8;
UPDATE public.moped_phases SET phase_name = 'Construction', phase_description = 'Project is in construction', phase_order = 10, phase_average_length = null, required_phase = null, subphases = '{6,7}' WHERE phase_id = 9;
UPDATE public.moped_phases SET phase_name = 'Post-construction', phase_description = 'Project is fully complete but pending actions or items to close it out', phase_order = 11, phase_average_length = null, required_phase = null, subphases = '{1,21}' WHERE phase_id = 10;
UPDATE public.moped_phases SET phase_name = 'Complete', phase_description = 'Project is fully complete and fully closed out', phase_order = 12, phase_average_length = null, required_phase = null, subphases = '{}' WHERE phase_id = 11;
-- Now insert the new phase
INSERT INTO public.moped_phases (phase_name, phase_description, phase_order, phase_average_length, required_phase, phase_id, subphases) VALUES ('Bid/Award/Execution', 'Project is under bidding, awarding, or execution state. ', 8, null, null, 12, '{20}');


/**
  Subphases
 */
-- We need to alter this as to allow subphases sharing the same name
alter table moped_subphases drop constraint if exists moped_subphases_subphase_name_key;

-- Potential's Sub-phase Changes
UPDATE public.moped_subphases SET subphase_name = 'Study recommended', subphase_description = null, subphase_order = 11, subphase_average_length = null, required_subphase = null, related_phase_id = 1 WHERE subphase_id = 11;
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (12, 'Study in progress', null, 12, null, null, 1);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (13, 'Environmental study', null, 13, null, null, 1);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (14, 'Recommended', null, 14, null, null, 1);
-- Planned Sub-phase Changes
UPDATE public.moped_subphases SET subphase_name = 'Environmental study', subphase_description = null, subphase_order = 9, subphase_average_length = null, required_subphase = null, related_phase_id = 2 WHERE subphase_id = 9;
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (15, 'Ready for design', null, 15, null, null, 2);
-- Design Sub-phase Changes
DELETE FROM moped_subphases WHERE subphase_id = 8; -- Deletes design by others
DELETE FROM moped_subphases WHERE subphase_id = 10; -- Deletes minor modification in progress

--
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (16, '30% Design', null, 16, null, null, 6);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (17, '60% Design', null, 17, null, null, 6);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (18, '90% Design', null, 18, null, null, 6);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (19, '100% Design', null, 19, null, null, 6);
-- Bid
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (20, 'Bid', null, 20, null, null, 12);
-- Construction sub-phases
UPDATE public.moped_subphases SET subphase_name = 'Below-ground construction', subphase_description = null, subphase_order = 6, subphase_average_length = null, required_subphase = null, related_phase_id = 9 WHERE subphase_id = 6;
UPDATE public.moped_subphases SET subphase_name = 'Above-ground construction', subphase_description = null, subphase_order = 7, subphase_average_length = null, required_subphase = null, related_phase_id = 9 WHERE subphase_id = 7;
-- Post-construction sub-phase
INSERT INTO public.moped_subphases (subphase_id, subphase_name, subphase_description, subphase_order, subphase_average_length, required_subphase, related_phase_id) VALUES (21, 'Warranty', null, 21, null, null, 10);


/**
  Milestones
 */
-- Updates
UPDATE public.moped_milestones SET milestone_name = 'Award', milestone_description = null, milestone_order = 1, milestone_average_length = null, required_milestone = null, related_phase_id = 10 WHERE milestone_id = 1;
UPDATE public.moped_milestones SET milestone_name = 'Bid open', milestone_description = null, milestone_order = 2, milestone_average_length = null, required_milestone = null, related_phase_id = 7 WHERE milestone_id = 2;
UPDATE public.moped_milestones SET milestone_name = 'Cabinet set', milestone_description = null, milestone_order = 3, milestone_average_length = null, required_milestone = null, related_phase_id = 7 WHERE milestone_id = 3;
UPDATE public.moped_milestones SET milestone_name = 'COA-hosted community engagement', milestone_description = null, milestone_order = 4, milestone_average_length = null, required_milestone = null, related_phase_id = 2 WHERE milestone_id = 4;
UPDATE public.moped_milestones SET milestone_name = 'Concrete construction end', milestone_description = null, milestone_order = 5, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 5;
UPDATE public.moped_milestones SET milestone_name = 'Concrete construction start', milestone_description = null, milestone_order = 6, milestone_average_length = null, required_milestone = null, related_phase_id = 9 WHERE milestone_id = 6;
UPDATE public.moped_milestones SET milestone_name = 'Construction contract award by Council date', milestone_description = null, milestone_order = 7, milestone_average_length = null, required_milestone = null, related_phase_id = 9 WHERE milestone_id = 7;
UPDATE public.moped_milestones SET milestone_name = 'Construction contract execution', milestone_description = null, milestone_order = 8, milestone_average_length = null, required_milestone = null, related_phase_id = 6 WHERE milestone_id = 8;
UPDATE public.moped_milestones SET milestone_name = 'Design Notice-to-Proceed', milestone_description = null, milestone_order = 9, milestone_average_length = null, required_milestone = null, related_phase_id = 2 WHERE milestone_id = 9;
UPDATE public.moped_milestones SET milestone_name = 'Environmental field work complete', milestone_description = null, milestone_order = 10, milestone_average_length = null, required_milestone = null, related_phase_id = 11 WHERE milestone_id = 10;
UPDATE public.moped_milestones SET milestone_name = 'Environmentally cleared', milestone_description = null, milestone_order = 11, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 11;
UPDATE public.moped_milestones SET milestone_name = 'Feasibility study', milestone_description = null, milestone_order = 12, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 12;
UPDATE public.moped_milestones SET milestone_name = 'First advertisement', milestone_description = null, milestone_order = 13, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 13;
UPDATE public.moped_milestones SET milestone_name = 'Initial field visit complete', milestone_description = null, milestone_order = 14, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 14;
UPDATE public.moped_milestones SET milestone_name = 'Issue COA striping work order for striping', milestone_description = null, milestone_order = 15, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 15;

-- Insertions
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (16, 'Issue DO for construction', null, 16, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (17, 'Markings construction end', null, 17, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (18, 'Markings construction start', null, 18, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (19, 'Notice-to-Proceed', null, 19, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (20, 'Other community engagement', null, 20, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (21, 'Permit approved', null, 21, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (22, 'Preliminary schematic complete', null, 22, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (23, 'Resurfacing complete', null, 23, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (24, 'Resurfacing or marking removal due date', null, 24, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (25, 'Resurfacing requested', null, 25, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (26, 'Resurfacing start', null, 26, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (27, 'Set up task order', null, 27, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (28, 'Signal construction end', null, 28, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (29, 'Signal construction start', null, 29, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (30, 'Study complete', null, 30, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (31, 'Submit ESPA', null, 31, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (32, 'Survey complete', null, 32, null, null, null);
INSERT INTO public.moped_milestones (milestone_id, milestone_name, milestone_description, milestone_order, milestone_average_length, required_milestone, related_phase_id) VALUES (33, 'Work order submitted', null, 33, null, null, null);
