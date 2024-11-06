INSERT INTO moped_proj_work_activity_status (key, name)
SELECT
    'active',
    'Active'
WHERE NOT EXISTS (
        SELECT *
        FROM
            moped_proj_work_activity_status
        WHERE (key, name) = ('active', 'Active')
    );
