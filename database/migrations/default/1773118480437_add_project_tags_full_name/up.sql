-- Add full_name generated column to moped_tags (project tags) to match moped_component_tags pattern
-- Used for display in Data Dictionary and downstream consumers
-- IF NOT EXISTS handles case where column was already added (e.g., previous partial migration run)
ALTER TABLE moped_tags
ADD COLUMN IF NOT EXISTS full_name TEXT GENERATED ALWAYS AS (
    CASE
        WHEN type IS NOT NULL AND name IS NOT NULL THEN type || ' - ' || name
        WHEN type IS NOT NULL THEN type
        WHEN name IS NOT NULL THEN name
    END
) STORED;

COMMENT ON COLUMN moped_tags.full_name IS 'Full name of the project tag; type and name are concatenated if both present';
