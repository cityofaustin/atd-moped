-- Make is_deleted non-nullable in moped_workgroup and moped_department
ALTER TABLE moped_workgroup
ALTER COLUMN is_deleted SET NOT NULL;

ALTER TABLE moped_department
ALTER COLUMN is_deleted SET NOT NULL;

-- Add is_deleted to moped_entity
ALTER TABLE moped_entity
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;


-- Soft delete the old entities
UPDATE moped_entity
SET is_deleted = TRUE
WHERE name IN ('COA PWD Sidewalks & Special Projects', 'COA PWD Urban Trails', 'COA ATD', 'COA PWD');

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

-- Insert new row for COA TPW with appropriate department_id and organization_id (no associated workgroup)
WITH organization_todo AS (
    SELECT organization_id FROM moped_organization WHERE organization_name = 'City of Austin'
),

department_todo AS (
    SELECT department_id FROM moped_department WHERE department_name = 'Austin Transportation and Public Works'
)

INSERT INTO moped_entity (entity_name, department_id, workgroup_id, organization_id, is_deleted)
SELECT
    'COA TPW' AS entity_name,
    d.department_id,
    NULL AS workgroup_id,
    o.organization_id,
    FALSE AS is_deleted
FROM department_todo AS d, organization_todo AS o;

-- Find any records (except the soft-deleted above) that have either ATD or PWD in them and replace with TPW
UPDATE moped_entity
SET
    entity_name = REPLACE(REPLACE(entity_name, 'ATD', 'TPW'), 'PWD', 'TPW')
WHERE
    (
        entity_name LIKE '%ATD%'
        OR entity_name LIKE '%PWD%'
    )
    AND (entity_name NOT IN ('COA PWD Sidewalks & Special Projects', 'COA PWD Urban Trails', 'COA ATD', 'COA PWD'));
