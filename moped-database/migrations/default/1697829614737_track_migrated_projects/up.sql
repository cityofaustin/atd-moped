ALTER TABLE moped_project
    ADD COLUMN is_migrated_from_access_db boolean NOT NULL DEFAULT FALSE;
