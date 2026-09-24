ALTER TABLE moped_milestones ADd COLUMN milestone_order integer;
INSERT INTO moped_milestones (milestone_id, milestone_name, milestone_order) values (0, 'Unknown', 999);
