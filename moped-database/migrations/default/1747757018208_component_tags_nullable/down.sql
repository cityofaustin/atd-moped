-- Make component tag names nullable again
ALTER TABLE moped_component_tags ALTER COLUMN name SET NOT NULL;

-- Update existing empty names to NULL
UPDATE moped_component_tags SET name = ''
WHERE name IS NULL;
