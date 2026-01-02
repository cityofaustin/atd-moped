-- Add VZ CSP MC1.2 project and component tags
INSERT INTO moped_component_tags (type, name, slug)
SELECT
    'Vision Zero',
    'CSP MC1.2',
    'vision_zero_citywide_strategic_plan_mc1_2'
WHERE NOT EXISTS (
        SELECT 1 FROM moped_component_tags
        WHERE type = 'Vision Zero'
            AND name = 'CSP MC1.2'
    );

INSERT INTO moped_tags (name, type, slug)
SELECT
    'Vision Zero - CSP MC1.2',
    'Other',
    'vision_zero_citywide_strategic_plan_mc1_2'
WHERE NOT EXISTS (
        SELECT 1 FROM moped_tags
        WHERE name = 'Vision Zero - CSP MC1.2'
            AND type = 'Other'
    );
