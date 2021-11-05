-- Restore Phases
DELETE FROM public.moped_phases WHERE phase_id > 11;
UPDATE public.moped_phases SET phase_name = 'Unknown', phase_description = 'Unknown - Default', phase_order = 999, phase_average_length = null, required_phase = null, subphases = null WHERE phase_id = 0;
UPDATE public.moped_phases SET phase_name = 'Potential', phase_description = 'Project has not been funded or prioritized; often part of needs assessment', phase_order = 1, phase_average_length = null, required_phase = null, subphases = '{4,5,9,10}' WHERE phase_id = 1;
UPDATE public.moped_phases SET phase_name = 'Planned', phase_description = 'Project is planned but has yet to move into additional phases', phase_order = 2, phase_average_length = null, required_phase = null, subphases = '{4,9}' WHERE phase_id = 2;
UPDATE public.moped_phases SET phase_name = 'Preliminary engineering', phase_description = 'Project feasibility and alternatives are being evaluated whether a scope has been detailed or not', phase_order = 3, phase_average_length = null, required_phase = null, subphases = null WHERE phase_id = 3;
UPDATE public.moped_phases SET phase_name = 'Scoping', phase_description = 'Project is prioritized but needs details on scope', phase_order = 4, phase_average_length = null, required_phase = null, subphases = null WHERE phase_id = 4;
UPDATE public.moped_phases SET phase_name = 'Preliminary design', phase_description = 'Project design is not yet underway but awaiting actions to move it to design', phase_order = 5, phase_average_length = null, required_phase = null, subphases = null WHERE phase_id = 5;
UPDATE public.moped_phases SET phase_name = 'Design', phase_description = 'Project is undergoing a traditional 30%, 60%, 90%, 100% design phase', phase_order = 6, phase_average_length = null, required_phase = null, subphases = '{8}' WHERE phase_id = 6;
UPDATE public.moped_phases SET phase_name = 'Pre-construction', phase_description = 'Project is dealing with permitting, procurement, or other processes needed between design and construction', phase_order = 7, phase_average_length = null, required_phase = null, subphases = '{2,3}' WHERE phase_id = 7;
UPDATE public.moped_phases SET phase_name = 'Construction-ready', phase_description = 'Project is ready for construction pending schedules, work orders, etc', phase_order = 8, phase_average_length = null, required_phase = null, subphases = null WHERE phase_id = 8;
UPDATE public.moped_phases SET phase_name = 'Construction', phase_description = 'Project is in construction', phase_order = 9, phase_average_length = null, required_phase = null, subphases = '{6,7}' WHERE phase_id = 9;
UPDATE public.moped_phases SET phase_name = 'Post-construction', phase_description = 'Project is fully complete but pending actions or items to close it out', phase_order = 10, phase_average_length = null, required_phase = null, subphases = '{1}' WHERE phase_id = 10;
UPDATE public.moped_phases SET phase_name = 'Complete', phase_description = 'Project is fully complete and fully closed out', phase_order = 11, phase_average_length = null, required_phase = null, subphases = '{10}' WHERE phase_id = 11;

-- Restore subphases
alter table public.moped_subphases drop constraint if exists moped_subphases_subphase_name_key;
DELETE FROM public.moped_subphases WHERE subphase_id > 11;
UPDATE public.moped_subphases SET subphase_name = 'Unknown', subphase_description = null, subphase_order = 999, subphase_average_length = null, required_subphase = null, related_phase_id = 0 WHERE subphase_id = 0;
UPDATE public.moped_subphases SET subphase_name = 'Post-inst. study', subphase_description = null, subphase_order = 1, subphase_average_length = null, required_subphase = null, related_phase_id = 10 WHERE subphase_id = 1;
UPDATE public.moped_subphases SET subphase_name = 'Procurement', subphase_description = null, subphase_order = 2, subphase_average_length = null, required_subphase = null, related_phase_id = 7 WHERE subphase_id = 2;
UPDATE public.moped_subphases SET subphase_name = 'Permitting', subphase_description = null, subphase_order = 3, subphase_average_length = null, required_subphase = null, related_phase_id = 7 WHERE subphase_id = 3;
UPDATE public.moped_subphases SET subphase_name = 'Study in progress', subphase_description = null, subphase_order = 4, subphase_average_length = null, required_subphase = null, related_phase_id = 2 WHERE subphase_id = 4;
UPDATE public.moped_subphases SET subphase_name = 'Active development review', subphase_description = null, subphase_order = 5, subphase_average_length = null, required_subphase = null, related_phase_id = 1 WHERE subphase_id = 5;
UPDATE public.moped_subphases SET subphase_name = 'Below ground construction', subphase_description = null, subphase_order = 6, subphase_average_length = null, required_subphase = null, related_phase_id = 9 WHERE subphase_id = 6;
UPDATE public.moped_subphases SET subphase_name = 'Above ground construction', subphase_description = null, subphase_order = 7, subphase_average_length = null, required_subphase = null, related_phase_id = 9 WHERE subphase_id = 7;
UPDATE public.moped_subphases SET subphase_name = 'Design by others', subphase_description = null, subphase_order = 8, subphase_average_length = null, required_subphase = null, related_phase_id = 6 WHERE subphase_id = 8;
UPDATE public.moped_subphases SET subphase_name = 'Environmental study in progress', subphase_description = null, subphase_order = 9, subphase_average_length = null, required_subphase = null, related_phase_id = 2 WHERE subphase_id = 9;
UPDATE public.moped_subphases SET subphase_name = 'Minor modifications in progress', subphase_description = null, subphase_order = 10, subphase_average_length = null, required_subphase = null, related_phase_id = 11 WHERE subphase_id = 10;
UPDATE public.moped_subphases SET subphase_name = 'Feasibility study', subphase_description = null, subphase_order = 11, subphase_average_length = null, required_subphase = null, related_phase_id = 1 WHERE subphase_id = 11;
alter table public.moped_subphases add constraint moped_subphases_subphase_name_key unique (subphase_name);


-- Restore Milestones
DELETE FROM public.moped_milestones WHERE milestone_id > 15;
alter table moped_milestones drop constraint if exists moped_milestones_milestone_name_key;
UPDATE public.moped_milestones SET milestone_name = 'Unknown', milestone_description = null, milestone_order = 999, milestone_average_length = null, required_milestone = null, related_phase_id = 0 WHERE milestone_id = 0;
UPDATE public.moped_milestones SET milestone_name = 'Environmentally cleared', milestone_description = null, milestone_order = 1, milestone_average_length = null, required_milestone = null, related_phase_id = 10 WHERE milestone_id = 1;
UPDATE public.moped_milestones SET milestone_name = 'Initial field visit complete', milestone_description = null, milestone_order = 2, milestone_average_length = null, required_milestone = null, related_phase_id = 7 WHERE milestone_id = 2;
UPDATE public.moped_milestones SET milestone_name = '100% design', milestone_description = null, milestone_order = 3, milestone_average_length = null, required_milestone = null, related_phase_id = 7 WHERE milestone_id = 3;
UPDATE public.moped_milestones SET milestone_name = '90% design', milestone_description = null, milestone_order = 4, milestone_average_length = null, required_milestone = null, related_phase_id = 2 WHERE milestone_id = 4;
UPDATE public.moped_milestones SET milestone_name = '60% design', milestone_description = null, milestone_order = 5, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 5;
UPDATE public.moped_milestones SET milestone_name = '30% design', milestone_description = null, milestone_order = 6, milestone_average_length = null, required_milestone = null, related_phase_id = 9 WHERE milestone_id = 6;
UPDATE public.moped_milestones SET milestone_name = 'Preliminary schematic complete', milestone_description = null, milestone_order = 7, milestone_average_length = null, required_milestone = null, related_phase_id = 9 WHERE milestone_id = 7;
UPDATE public.moped_milestones SET milestone_name = 'Study complete', milestone_description = null, milestone_order = 8, milestone_average_length = null, required_milestone = null, related_phase_id = 6 WHERE milestone_id = 8;
UPDATE public.moped_milestones SET milestone_name = 'Work order submitted', milestone_description = null, milestone_order = 9, milestone_average_length = null, required_milestone = null, related_phase_id = 2 WHERE milestone_id = 9;
UPDATE public.moped_milestones SET milestone_name = 'Resurfacing not required', milestone_description = null, milestone_order = 10, milestone_average_length = null, required_milestone = null, related_phase_id = 11 WHERE milestone_id = 10;
UPDATE public.moped_milestones SET milestone_name = 'Resurfacing scheduled', milestone_description = null, milestone_order = 11, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 11;
UPDATE public.moped_milestones SET milestone_name = 'Resurfacing deferred', milestone_description = null, milestone_order = 12, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 12;
UPDATE public.moped_milestones SET milestone_name = 'Resurfacing requested', milestone_description = null, milestone_order = 13, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 13;
UPDATE public.moped_milestones SET milestone_name = 'Need to request resurfacing', milestone_description = null, milestone_order = 14, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 14;
UPDATE public.moped_milestones SET milestone_name = 'Already resurfaced', milestone_description = null, milestone_order = 15, milestone_average_length = null, required_milestone = null, related_phase_id = 1 WHERE milestone_id = 15;
alter table public.moped_milestones add constraint moped_milestones_milestone_name_key unique (milestone_name);

