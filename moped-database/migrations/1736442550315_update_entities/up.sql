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
WHERE entity_name IN ('COA PWD Sidewalks & Special Projects', 'COA PWD Urban Trails', 'COA ATD', 'COA PWD');

-- Insert new COA TPW Sidewalks and Urban Trails entity with appropriate department_id, workgroup_id, and organization_id
WITH
workgroup AS (
    SELECT workgroup_id
    FROM
        moped_workgroup
    WHERE
        workgroup_name = 'Sidewalks and Urban Trails'
),

organization AS (
    SELECT organization_id
    FROM
        moped_organization
    WHERE
        organization_name = 'City of Austin'
),

department AS (
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
    department AS d,
    workgroup AS w,
    organization AS o;

-- Insert new row for COA TPW with appropriate department_id and organization_id (no associated workgroup)
WITH organization AS (
    SELECT organization_id FROM moped_organization WHERE organization_name = 'City of Austin'
),

department AS (
    SELECT department_id FROM moped_department WHERE department_name = 'Austin Transportation and Public Works'
)

INSERT INTO moped_entity (entity_name, department_id, workgroup_id, organization_id, is_deleted)
SELECT
    'COA TPW' AS entity_name,
    d.department_id,
    NULL AS workgroup_id,
    o.organization_id,
    FALSE AS is_deleted
FROM department AS d, organization AS o;

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

-- UPDATE PROJECT SPONSORS

-- Find and update projects that need sponsor to be updated to COA TPW Sidewalks and Urban Trails
WITH project_sponsor_todos AS (
    SELECT entity_id AS ids
    FROM
        moped_entity
    WHERE
        entity_name IN (
            'COA PWD Sidewalks & Special Projects',
            'COA PWD Urban Trails'
        )
),

new_entity_row AS (
    SELECT entity_id AS id
    FROM
        moped_entity
    WHERE
        entity_name = 'COA TPW Sidewalks and Urban Trails'
)

UPDATE
moped_project
SET
    project_sponsor = (SELECT id FROM new_entity_row)
WHERE
    project_sponsor IN (SELECT ids FROM project_sponsor_todos);

-- Find and update projects that need sponsor to be updated to COA TPW
WITH project_sponsor_todos AS (
    SELECT entity_id AS ids
    FROM
        moped_entity
    WHERE
        entity_name IN (
            'COA ATD',
            'COA PWD'
        )
),

new_entity_row AS (
    SELECT entity_id AS id
    FROM
        moped_entity
    WHERE
        entity_name = 'COA TPW'
)

UPDATE
moped_project
SET
    project_sponsor = (SELECT id FROM new_entity_row)
WHERE
    project_sponsor IN (SELECT ids FROM project_sponsor_todos);

-- UPDATE PROJECT LEADS

-- Find and update projects that need lead to be updated to COA TPW Sidewalks and Urban Trails
WITH project_lead_todos AS (
    SELECT entity_id AS ids
    FROM
        moped_entity
    WHERE
        entity_name IN (
            'COA PWD Sidewalks & Special Projects',
            'COA PWD Urban Trails'
        )
),

new_entity_row AS (
    SELECT entity_id AS id
    FROM
        moped_entity
    WHERE
        entity_name = 'COA TPW Sidewalks and Urban Trails'
)

UPDATE
moped_project
SET
    project_lead_id = (SELECT id FROM new_entity_row)
WHERE
    project_lead_id IN (SELECT ids FROM project_lead_todos);

-- Find and update projects that need lead to be updated to COA TPW
WITH project_lead_todos AS (
    SELECT entity_id AS ids
    FROM
        moped_entity
    WHERE
        entity_name IN (
            'COA ATD',
            'COA PWD'
        )
),

new_entity_row AS (
    SELECT entity_id AS id
    FROM
        moped_entity
    WHERE
        entity_name = 'COA TPW'
)

UPDATE
moped_project
SET
    project_lead_id = (SELECT id FROM new_entity_row)
WHERE
    project_lead_id IN (SELECT ids FROM project_lead_todos);

-- UPDATE PROJECT PARTNERS

-- Find and update projects that need lead to be updated to COA TPW Sidewalks and Urban Trails
WITH project_partner_todos AS (
    SELECT entity_id AS ids
    FROM
        moped_entity
    WHERE
        entity_name IN (
            'COA PWD Sidewalks & Special Projects',
            'COA PWD Urban Trails'
        )
),

new_entity_row AS (
    SELECT entity_id AS id
    FROM
        moped_entity
    WHERE
        entity_name = 'COA TPW Sidewalks and Urban Trails'
)

UPDATE
moped_proj_partners
SET
    entity_id = (SELECT id FROM new_entity_row)
WHERE
    entity_id IN (SELECT ids FROM project_partner_todos);

-- Find and update projects that need lead to be updated to COA TPW
WITH project_partner_todos AS (
    SELECT entity_id AS ids
    FROM
        moped_entity
    WHERE
        entity_name IN (
            'COA ATD',
            'COA PWD'
        )
),

new_entity_row AS (
    SELECT entity_id AS id
    FROM
        moped_entity
    WHERE
        entity_name = 'COA TPW'
)

UPDATE
moped_proj_partners
SET
    entity_id = (SELECT id FROM new_entity_row)
WHERE
    entity_id IN (SELECT ids FROM project_partner_todos);
