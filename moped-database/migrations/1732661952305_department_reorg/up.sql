-- Add soft deletes to department table
ALTER TABLE moped_department ADD is_deleted boolean DEFAULT FALSE;

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
