-- Step 1: Rename column and add audit columns to moped_proj_components
ALTER TABLE moped_proj_components
  RENAME COLUMN date_added TO created_at;

ALTER TABLE moped_proj_components
  ADD COLUMN created_by_user_id INTEGER,
  ADD COLUMN updated_by_user_id INTEGER,
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- Step 2: Ensure the created_at column has the correct default value
ALTER TABLE moped_proj_components
  ALTER COLUMN created_at SET DEFAULT now();

-- Step 3: Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create the trigger that uses the function
CREATE TRIGGER set_updated_at_before_update
BEFORE UPDATE ON moped_proj_components
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
