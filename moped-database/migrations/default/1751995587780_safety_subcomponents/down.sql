-- Revert update to existing subcomponent
UPDATE moped_subcomponents SET subcomponent_name = 'Bicycle signal face (interim approval)'
WHERE subcomponent_name = 'Bicycle signal face (interim approval / protected only)';

-- Remove Speed Limit Changes subcomponent from Project Extent - Generic (linear) and Roadway components
DELETE FROM moped_components_subcomponents
WHERE component_id IN (
        SELECT component_id
        FROM moped_components
        WHERE component_name_full = 'Project Extent - Generic (linear)'
            OR component_name_full = 'Roadway'
    )
    AND subcomponent_id = (
        SELECT subcomponent_id
        FROM moped_subcomponents
        WHERE subcomponent_name = 'Speed Limit Changes'
    );

-- Remove new Speed Limit Changes subcomponent
DELETE FROM moped_subcomponents
WHERE subcomponent_name = 'Speed Limit Changes';
