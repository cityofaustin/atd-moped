-- Remove the associations between Signal - Traffic component and the new subcomponents
DELETE FROM moped_components_subcomponents 
WHERE component_id = 18 
AND subcomponent_id IN (
    SELECT subcomponent_id 
    FROM moped_subcomponents 
    WHERE subcomponent_name IN (
        'Bicycle signal (may use pedestrian signal sign)',
        'Bicycle signal (permissive conflicts)'
    )
);

-- Remove the new subcomponents
DELETE FROM moped_subcomponents 
WHERE subcomponent_name IN (
    'Bicycle signal (may use pedestrian signal sign)',
    'Bicycle signal (permissive conflicts)'
); 