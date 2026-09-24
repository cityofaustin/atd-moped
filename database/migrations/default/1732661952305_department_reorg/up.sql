-- Add soft deletes to department table
ALTER TABLE moped_department ADD is_deleted boolean DEFAULT FALSE;
COMMENT ON COLUMN moped_department.is_deleted IS 'Indicates soft deletion';

INSERT INTO "public"."moped_department" ("department_name", "department_abbreviation", "organization_id") VALUES
('Austin Transportation and Public Works', 'TPW', 1);

-- Soft delete existing department records that are merging into the new one
UPDATE moped_department SET is_deleted = TRUE WHERE department_name IN ('Austin Transportation', 'Public Works');

-- Find existing workgroup records that are associated with the departments that are merging
-- and update them to the new department row called Austin Transportation and Public Works
WITH department_todos AS (
    SELECT department_id AS ids
    FROM
        moped_department
    WHERE
        department_name IN (
            'Austin Transportation',
            'Public Works'
        )
),

new_department_row AS (
    SELECT department_id AS id
    FROM
        moped_department
    WHERE
        department_name = 'Austin Transportation and Public Works'
)

UPDATE
moped_workgroup
SET
    department_id = (SELECT id FROM new_department_row)
WHERE
    department_id IN (SELECT ids FROM department_todos);

-- Find existing entity records that are associated with the departments that are merging
-- and update them to the new department row called Austin Transportation and Public Works
WITH department_todos AS (
    SELECT department_id AS ids
    FROM
        moped_department
    WHERE
        department_name IN (
            'Austin Transportation',
            'Public Works'
        )
),

new_department_row AS (
    SELECT department_id AS id
    FROM
        moped_department
    WHERE
        department_name = 'Austin Transportation and Public Works'
)

UPDATE
moped_entity
SET
    department_id = (SELECT id FROM new_department_row)
WHERE
    department_id IN (SELECT ids FROM department_todos);

-- Add foreign key constraints to entity table department_id column; moped_workgroup already has this constraint
ALTER TABLE moped_entity
ADD CONSTRAINT moped_entity_department_id_fkey FOREIGN KEY ("department_id")
REFERENCES moped_department ("department_id");

-- Add foreign key constraints to entity table workgroup_id column
ALTER TABLE moped_entity
ADD CONSTRAINT moped_entity_workgroup_id_fkey FOREIGN KEY ("workgroup_id")
REFERENCES moped_workgroup ("workgroup_id");

-- Add foreign key constraints to department and entity tables for organization_id columns
ALTER TABLE moped_entity
ADD CONSTRAINT moped_entity_organization_id_fkey FOREIGN KEY ("organization_id")
REFERENCES moped_organization ("organization_id");

ALTER TABLE moped_department
ADD CONSTRAINT moped_department_organization_id_fkey FOREIGN KEY ("organization_id")
REFERENCES moped_organization ("organization_id");

-- Remove row with 0 for id and 'None' for name; we're not using it and null is more appropriate for entities and workgroups with no department
DELETE FROM moped_department WHERE department_id = 0;
