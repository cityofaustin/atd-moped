-- Add two new bicycle signal subcomponents for Signal - Traffic component
INSERT INTO moped_subcomponents (subcomponent_name) VALUES 
    ('Bicycle signal (may use pedestrian signal sign)'),
    ('Bicycle signal (permissive conflicts)');

-- Associate the new subcomponents with Signal - Traffic component (component_id = 18)
INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
SELECT 
    18 as component_id,
    subcomponent_id
FROM moped_subcomponents 
WHERE subcomponent_name IN (
    'Bicycle signal (may use pedestrian signal sign)',
    'Bicycle signal (permissive conflicts)'
); 