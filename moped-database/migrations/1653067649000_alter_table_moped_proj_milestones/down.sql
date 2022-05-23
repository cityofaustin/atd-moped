-- replace dropped columns
ALTER TABLE moped_proj_milestones ADD COLUMN milestone_name TEXT NOT NULL;
ALTER TABLE moped_proj_milestones ADD COLUMN milestone_related_phase_id INT;


-- get milestone_name based on milestone_id
update moped_proj_milestones mpm
set milestone_name = LOWER(mm.milestone_name)
from moped_milestones mm
where mpm.milestone_id = mm.milestone_id;

-- get milestone_related_phase_id based on milestone_id
update moped_proj_milestones mpm
set milestone_related_phase_id = mm.related_phase_id
from moped_milestones mm
where mpm.milestone_id = mm.milestone_id;

-- delete milestone_id column from moped_proj_milestones
ALTER TABLE moped_proj_milestones DROP COLUMN milestone_id;
