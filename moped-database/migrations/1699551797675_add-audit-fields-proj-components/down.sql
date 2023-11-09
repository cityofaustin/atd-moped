-- Step 1: Drop the trigger
DROP TRIGGER IF EXISTS set_updated_at_before_update ON moped_proj_components;

-- Step 2: Drop the function
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Step 3: Remove the audit columns
ALTER TABLE moped_proj_components
  DROP COLUMN IF EXISTS created_by_user_id,
  DROP COLUMN IF EXISTS updated_by_user_id,
  DROP COLUMN IF EXISTS updated_at;

-- Step 4: Rename the created_at column back to date_added and remove the default value
ALTER TABLE moped_proj_components
  ALTER COLUMN created_at DROP DEFAULT;

ALTER TABLE moped_proj_components
  RENAME COLUMN created_at TO date_added;
