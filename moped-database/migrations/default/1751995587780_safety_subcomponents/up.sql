-- Update existing subcomponent
UPDATE moped_subcomponents SET subcomponent_name = 'Bicycle signal face (interim approval / protected only)'
WHERE subcomponent_name = 'Bicycle signal face (interim approval)';

-- Add new Speed Limit Changes subcomponent
INSERT INTO moped_subcomponents (subcomponent_name) VALUES ('Speed Limit Changes');

-- Add Speed Limit Changes subcomponent to Project Extent - Generic (linear) and Roadway
INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
SELECT 
    mc.component_id,
    ms.subcomponent_id
FROM moped_components mc
CROSS JOIN moped_subcomponents ms
WHERE mc.component_name_full IN ('Project Extent - Generic (linear)', 'Roadway')
AND ms.subcomponent_name = 'Speed Limit Changes';
