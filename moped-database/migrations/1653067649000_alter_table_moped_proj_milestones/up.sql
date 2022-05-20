-- add milestone_id column to moped_proj_milestones
ALTER TABLE moped_proj_milestones ADD COLUMN milestone_id integer;

update moped_proj_milestones mpm
set milestone_id = mm.milestone_id
from moped_milestones mm
where mpm.milestone_name = LOWER(mm.milestone_name);

ALTER TABLE moped_proj_milestones
    ADD CONSTRAINT moped_project_milestone_milestone_id_fkey
    FOREIGN KEY (milestone_id)
    REFERENCES moped_milestones(milestone_id);