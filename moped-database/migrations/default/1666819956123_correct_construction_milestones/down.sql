-- Revert related phhse of "Cabinet set" to "Pre Construction"
UPDATE moped_milestones SET related_phase_id = 7 WHERE milestone_id = 3;
