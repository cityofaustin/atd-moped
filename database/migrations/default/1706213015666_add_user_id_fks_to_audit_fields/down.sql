ALTER TABLE moped_proj_funding
    DROP CONSTRAINT created_by_user_fkey,
    DROP CONSTRAINT updated_by_user_fkey;

ALTER TABLE moped_project
    DROP CONSTRAINT updated_by_user_fkey;
