-- This example finds all users who were previously in the 'Sidewalks' or 'Urban Trails' workgroups and sets their 
-- workgroup to the new, merged workgroup called 'Sidewalks and Urban Trails'.
-- This is useful when merging workgroups and needing to update all users associated with the old workgroups.
-- See https://github.com/cityofaustin/atd-moped/pull/1515
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
