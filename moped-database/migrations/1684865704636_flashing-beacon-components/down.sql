-- change component back to "Signage - RRFB"
-- note: we cannot undo conversion of Signal - RRFB to Signage - RRFB
UPDATE
    moped_components
SET
    component_name = 'Signage'
WHERE
    component_name = 'Flashing Beacon'
    AND component_subtype = 'RRFB';

-- revert set the old signal component to deleted
UPDATE
    moped_components
SET
    is_deleted = FALSE
WHERE
    component_id = old_component_id;

-- delete new beacon types
delete from  moped_components where component_name = 'Flashing Beacon';
