UPDATE
    moped_components
SET
    component_name = 'Signage'
WHERE
    component_name = 'Flashing Beacon'
    AND component_subtype = 'RRFB';

-- revert update proj components using old signal - rrfb component and make it deleted
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
        component_id = old_component_id
    WHERE
        component_id = new_component_id;

    -- revert set the old signal component to deleted
    UPDATE
        moped_components
    SET
        is_deleted = FALSE
    WHERE
        component_id = old_component_id;
END
$$;

-- delete new beacon types
delete from  moped_components where component_name = 'Flashing Beacon';
