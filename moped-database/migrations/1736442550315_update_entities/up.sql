-- Make is_deleted non-nullable in moped_workgroup and moped_department
ALTER TABLE moped_workgroup
ALTER COLUMN is_deleted SET NOT NULL;

ALTER TABLE moped_department
ALTER COLUMN is_deleted SET NOT NULL;

-- Add is_deleted to moped_entity
ALTER TABLE moped_entity
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;
