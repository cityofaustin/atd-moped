-- Add project and component tags to exclude from Moped <> VZ crash statistics
INSERT INTO moped_component_tags (type, name, slug)
SELECT
    'Exclude from Crash Statistics',
    NULL,
    'exclude_from_crash_statistics'
WHERE NOT EXISTS (
        SELECT 1 FROM moped_component_tags
        WHERE type = 'Exclude from Crash Statistics'
            AND name IS NULL
    );

INSERT INTO moped_tags (name, type, slug)
SELECT
    'Exclude from Crash Statistics',
    'Other',
    'exclude_from_crash_statistics'
WHERE NOT EXISTS (
        SELECT 1 FROM moped_tags
        WHERE name = 'Exclude from Crash Statistics'
            AND type = 'Other'
    );
