-- Update existing subcomponent
UPDATE moped_subcomponents SET subcomponent_name = 'Bicycle signal face (interim approval / protected only)'
WHERE subcomponent_name = 'Bicycle signal face (interim approval)';

-- Add Speed Limit Changes subcomponent to Project Extent - Generic (linear) and Roadway


-- INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
-- SELECT 
--     (SELECT component_id FROM moped_components WHERE component_name = 'Signal' AND component_subtype = 'Traffic') as component_id,
--     subcomponent_id
-- FROM moped_subcomponents 
-- WHERE subcomponent_name IN (
--     'Bicycle signal (may use pedestrian signal sign)',
--     'Bicycle signal (permissive conflicts)'
-- );
