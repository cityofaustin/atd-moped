CREATE SCHEMA deprecated;

ALTER TABLE moped_types
SET SCHEMA deprecated;

COMMENT ON TABLE deprecated.moped_types IS 'This table is no longer in use as of January 2025.';

ALTER TABLE moped_project_types
SET SCHEMA deprecated;

COMMENT ON TABLE deprecated.moped_project_types IS 'This table is no longer in use as of January 2025.';
