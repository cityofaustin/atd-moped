ALTER TABLE moped_milestones DROP COLUMN milestone_order;
DELETE FROM moped_milestones where milestone_id = 0;
