-- Revert Rename "Preliminary schematic complete" to "Schematic Complete" and change phase to "Prelim Design"
UPDATE moped_milestones SET milestone_name = 'Preliminary schematic complete', related_phase_id = null WHERE milestone_id = 22;

-- Revert Rename "Award" to "Design Award" and phase should be blank
UPDATE moped_milestones SET milestone_name = 'Design Award', related_phase_id = 10 WHERE milestone_id = 1;

-- Revert Change "Design Notice-to-Proceed" phase from "Planned" to "Design"
UPDATE moped_milestones SET related_phase_id = 2 WHERE milestone_id = 9;

-- Revert Rename "Construction contract award by Council date" to "Construction Award" and change phase from "Construction" to "Bid/Award/Execution"
UPDATE moped_milestones SET milestone_name = 'Construction contract award by Council date', related_phase_id = 9 WHERE milestone_id = 7;

-- Revert Set related pahse of "Construction contract execution" to "Bid/Award/Execution"
UPDATE moped_milestones SET related_phase_id = null WHERE milestone_id = 8;

-- Revert Set phase of "Permit approved" to "Pre-construction"
UPDATE moped_milestones SET related_phase_id = null WHERE milestone_id = 21;

-- Revert Rename "Notice-to-Proceed" to "Construction Notice-to-Proceed" and set phase to "Construction"
UPDATE moped_milestones SET milestone_name = 'Notice-to-Proceed', related_phase_id = 2 WHERE milestone_id = 19;

-- Revert Set related phase of COA-hosted community engagement from Planned to blank
UPDATE moped_milestones SET related_phase_id = 1 WHERE milestone_id = 4;
