ALTER TABLE moped_components
    ADD COLUMN asset_feature_layer_id integer
    REFERENCES feature_layers (id)
    ON UPDATE CASCADE ON DELETE SET NULL;

COMMENT ON COLUMN moped_components.asset_feature_layer_id IS
    'Foreign key which indicates if the component supports storing data from a reference asset layer, and in which layer that data should be stored';

-- make default layer for signals and phbs be intersections
-- and set asset layer to signals 
UPDATE
    moped_components
SET
    feature_layer_id = 5,
    asset_feature_layer_id = 3
WHERE
    component_subtype = 'PHB'
    OR component_subtype = 'Traffic';

