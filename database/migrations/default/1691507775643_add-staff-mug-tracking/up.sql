ALTER TABLE moped_users
    ADD COLUMN is_user_group_member boolean NOT NULL DEFAULT FALSE,
        ADD COLUMN note text;

COMMENT ON COLUMN moped_users.is_user_group_member IS 'Tracks if the user is a member of the Moped User Group, aka the MUG.';

COMMENT ON COLUMN moped_users.note IS 'A place to add any notes about this user, e.g. why they were deactivated.';
