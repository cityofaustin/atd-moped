-- Add soft deletes to workgroup table
ALTER TABLE moped_workgroup ADD is_deleted boolean DEFAULT FALSE;
COMMENT ON COLUMN moped_workgroup.is_deleted IS 'Indicates soft deletion';

INSERT INTO moped_workgroup ("workgroup_name", "workgroup_abbreviation", "department_id") VALUES
('Sidewalks and Urban Trails', 'SUTD', 11);

-- Soft delete existing workgroup records that are merging into the new one
UPDATE moped_workgroup SET is_deleted = TRUE WHERE workgroup_name IN ('Sidewalks', 'Urban Trails');

-- Find existing users records that are associated with the workgroups that are merging
-- and update them to the new workgroup row for SUTD
WITH user_todos AS (
    SELECT workgroup_id AS ids
    FROM
        moped_workgroup
    WHERE
        workgroup_name IN (
            'Sidewalks',
            'Urban Trails'
        )
),

new_workgroup_row AS (
    SELECT workgroup_id AS id
    FROM
        moped_workgroup
    WHERE
        workgroup_name = 'Sidewalks and Urban Trails'
)

UPDATE
moped_users
SET
    workgroup_id = (SELECT id FROM new_workgroup_row)
WHERE
    workgroup_id IN (SELECT ids FROM user_todos);
