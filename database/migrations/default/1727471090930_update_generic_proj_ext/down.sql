-- Update Project Extent - Generic (point) components to Intersection Improvement (point) before deleting component type
UPDATE moped_proj_components SET component_id = 66 WHERE component_id = 133;

-- Now delete Project Extent - Generic (point) component type and clean up component work types
DELETE FROM moped_components WHERE component_name = 'Project Extent - Generic' AND line_representation = false;
DELETE FROM moped_component_work_types WHERE component_id = 133;

-- And restore previous name for linear generic extent
UPDATE moped_components
SET component_name = 'Project Extent - Generic'
WHERE component_name = 'Project Extent - Generic (linear)' AND line_representation = true;
