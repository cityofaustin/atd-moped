--  set asset layer for school beacon to signals 
UPDATE moped_components
SET
    feature_layer_id = 5,
    asset_feature_layer_id = 3
WHERE
    component_subtype = 'School Zone Beacon';
