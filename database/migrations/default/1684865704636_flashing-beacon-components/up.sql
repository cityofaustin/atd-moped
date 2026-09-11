-- rename Signage - RRFB to Flashing Beacon - RRFB
UPDATE
    moped_components
SET
    component_name = 'Flashing Beacon'
WHERE
    component_name = 'Signage'
    AND component_subtype = 'RRFB';

-- create additional beacon types
INSERT into moped_components (component_name, component_subtype, line_representation, feature_layer_id) values
    ('Flashing Beacon', 'Curve Warning', FALSE, 5),
    ('Flashing Beacon', 'Hazard', FALSE, 5),
    ('Flashing Beacon', 'Intersection', FALSE, 5),
    ('Flashing Beacon', 'Pedestrian', FALSE, 5),
    ('Flashing Beacon', 'Signal Ahead', FALSE, 5),
    ('Flashing Beacon', 'Speed Limit', FALSE, 5),
    ('Flashing Beacon', 'Stop Sign', FALSE, 5);

-- update proj components using old signal - rrfb component and make it deleted
DO $$
DECLARE
    old_component_id INTEGER;
    new_component_id INTEGER;
BEGIN
    -- get signal - rrfb component id
    SELECT
        component_id INTO old_component_id
    FROM
        moped_components
    WHERE
        component_name = 'Signal'
        AND component_subtype = 'RRFB';
    
    -- get flashing beacon - rrfb component id
    SELECT
        component_id INTO new_component_id
    FROM
        moped_components
    WHERE
        component_name = 'Flashing Beacon'
        AND component_subtype = 'RRFB';
    
    -- update all proj components using the old id
    UPDATE
        moped_proj_components
    SET
        component_id = new_component_id
    WHERE
        component_id = old_component_id;

    -- set the old signal component to deleted
    UPDATE
        moped_components
    SET
        is_deleted = TRUE
    WHERE
        component_id = old_component_id;
END
$$;
