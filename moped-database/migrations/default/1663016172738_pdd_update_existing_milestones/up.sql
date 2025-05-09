-- Rename "	Preliminary schematic complete" to "Schematic Complete" and change phase to "Prelim Design"
UPDATE moped_milestones SET milestone_name = 'Schematic Complete', related_phase_id = 5 WHERE milestone_id = 22;

-- Rename "Award" to "Design Award" and phase should be blank
UPDATE moped_milestones SET milestone_name = 'Design Award', related_phase_id = null WHERE milestone_id = 1;

-- Change "Design Notice-to-Proceed" phase from "Planned" to "Design"
UPDATE moped_milestones SET related_phase_id = 6 WHERE milestone_id = 9;

-- Rename "Construction contract award by Council date" to "Construction Award" and change phase from "Construction" to "Bid/Award/Execution"
UPDATE moped_milestones SET milestone_name = 'Construction Award', related_phase_id = 12 WHERE milestone_id = 7;

-- Set related pahse of "Construction contract execution" to "Bid/Award/Execution"
UPDATE moped_milestones SET related_phase_id = 12 WHERE milestone_id = 8;

-- Set phase of "Permit approved" to "Pre-construction"
UPDATE moped_milestones SET related_phase_id = 	7 WHERE milestone_id = 21;

-- Rename "Notice-to-Proceed" to "Construction Notice-to-Proceed" and set phase to "Construction"
UPDATE moped_milestones SET milestone_name = 'Construction Notice-to-Proceed', related_phase_id = 9 WHERE milestone_id = 19;

-- Set related phase of COA-hosted community engagement from Planned to blank
UPDATE moped_milestones SET related_phase_id = null WHERE milestone_id = 4;
