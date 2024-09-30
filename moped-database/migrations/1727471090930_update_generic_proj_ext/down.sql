UPDATE moped_components SET is_deleted = true WHERE component_name = 'Project Extent - Generic' AND line_representation = false;

UPDATE moped_components
SET component_name = 'Project Extent - Generic'
WHERE component_name = 'Project Extent - Generic (linear)' AND line_representation = true;
