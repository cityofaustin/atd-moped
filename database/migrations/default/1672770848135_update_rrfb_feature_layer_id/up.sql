-- Update RRFB component to use feature_intersections layer
UPDATE moped_components SET feature_layer_id = 5 WHERE component_id = 17;
