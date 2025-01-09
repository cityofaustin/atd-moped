-- Make is_deleted non-nullable in moped_workgroup and moped_department
ALTER TABLE moped_workgroup
ALTER COLUMN is_deleted SET NOT NULL;

ALTER TABLE moped_department
ALTER COLUMN is_deleted SET NOT NULL;

-- Add is_deleted to moped_entity
ALTER TABLE moped_entity
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;

---- moped_workgroup
SELECT workgroup_id FROM moped_workgroup WHERE workgroup_name = 'Sidewalks and Urban Trails';

-- moped_organization
SELECT organization_id FROM moped_organization WHERE organization_name = 'City of Austin';

-- moped_department
SELECT department_id FROM moped_department WHERE department_name = 'Austin Transportation and Public Works';
