UPDATE moped_components
SET component_name = 'Project Extent - Generic (linear)'
WHERE component_name = 'Project Extent - Generic' AND line_representation = true;

-- Insert new point component for generic project extent
INSERT INTO moped_components (component_name, line_representation, feature_layer_id)
VALUES ('Project Extent - Generic', false, 5);
