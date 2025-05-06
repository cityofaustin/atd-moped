UPDATE moped_proj_notes
SET added_by_user_id = moped_users.user_id
FROM moped_users 
WHERE
    added_by_user_id = 1
    AND
    moped_proj_notes.added_by = moped_users.first_name || ' ' || moped_users.last_name;
