-- revert asset layer for school zone beacons
UPDATE moped_components
SET
    asset_feature_layer_id = NULL
WHERE
    component_subtype = 'School Zone Beacon';
