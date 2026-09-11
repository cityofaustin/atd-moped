-- Add Transportation Demand Management (TDM) as a workgroup and entity.

WITH
department AS (
    SELECT department_id
    FROM
        moped_department
    WHERE
        department_name = 'Austin Transportation and Public Works'
),

organization AS (
    SELECT organization_id
    FROM
        moped_organization
    WHERE
        organization_abbreviation = 'COA'
),

new_workgroup AS (
    INSERT INTO
    moped_workgroup (workgroup_name, workgroup_abbreviation, department_id, is_deleted)
    SELECT
        'Transportation Demand Management' AS workgroup_name,
        'TDM' AS workgroup_abbreviation,
        department.department_id,
        FALSE AS is_deleted
    FROM
        department
    RETURNING
        workgroup_id
)

INSERT INTO
moped_entity (entity_name, workgroup_id, organization_id, department_id, is_deleted)
SELECT
    'COA ATPW Transportation Demand Management' AS entity_name,
    new_workgroup.workgroup_id,
    organization.organization_id,
    department.department_id,
    FALSE AS is_deleted
FROM
    department,
    organization,
    new_workgroup;
