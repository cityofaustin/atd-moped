-- add milestone_id column to moped_proj_milestones
ALTER TABLE moped_proj_milestones ADD COLUMN milestone_id integer;

-- get milestone_id based on milestone_name
update moped_proj_milestones mpm
set milestone_id = mm.milestone_id
from moped_milestones mm
where mpm.milestone_name = LOWER(mm.milestone_name);

ALTER TABLE moped_proj_milestones ALTER COLUMN milestone_id SET NOT NULL;

-- set milestone_id as foreign key
ALTER TABLE moped_proj_milestones
    ADD CONSTRAINT moped_project_milestone_milestone_id_fkey
    FOREIGN KEY (milestone_id)
    REFERENCES moped_milestones(milestone_id);

-- drop milestone_name since it can now be accessed through fk relationship
ALTER TABLE moped_proj_milestones DROP COLUMN milestone_name;

