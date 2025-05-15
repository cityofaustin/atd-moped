--  set asset layer for school beacon to signals 
UPDATE moped_components
SET
    asset_feature_layer_id = 6
WHERE
    component_subtype = 'School Zone Beacon';
