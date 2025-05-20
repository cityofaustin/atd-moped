-- Remove not null on name
ALTER TABLE moped_component_tags ALTER COLUMN name DROP NOT NULL;

-- Update existing empty names to NULL
UPDATE moped_component_tags SET name = NULL
WHERE name = '';
