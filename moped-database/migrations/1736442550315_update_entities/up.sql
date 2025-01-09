-- Make is_deleted non-nullable in moped_workgroup and moped_department
ALTER TABLE moped_workgroup
ALTER COLUMN is_deleted SET NOT NULL;

ALTER TABLE moped_department
ALTER COLUMN is_deleted SET NOT NULL;

-- Add is_deleted to moped_entity
ALTER TABLE moped_entity
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- Insert new COA TPW Sidewalks and Urban Trails entity with appropriate department_id, workgroup_id, and organization_id
WITH
workgroup_todo AS (
    SELECT workgroup_id
    FROM
        moped_workgroup
    WHERE
        workgroup_name = 'Sidewalks and Urban Trails'
),

organization_todo AS (
    SELECT organization_id
    FROM
        moped_organization
    WHERE
        organization_name = 'City of Austin'
),

department_todo AS (
    SELECT department_id
    FROM
        moped_department
    WHERE
        department_name = 'Austin Transportation and Public Works'
)

INSERT INTO
moped_entity (entity_name, department_id, workgroup_id, organization_id)
SELECT
    'COA TPW Sidewalks and Urban Trails' AS entity_name,
    d.department_id,
    w.workgroup_id,
    o.organization_id
FROM
    department_todo AS d,
    workgroup_todo AS w,
    organization_todo AS o;


-- Create new rows:
-- 2. COA TPW
--    department_id is id that matches Austin Transportation and Public Works in moped_department table
--    workgroup_id is NULL
