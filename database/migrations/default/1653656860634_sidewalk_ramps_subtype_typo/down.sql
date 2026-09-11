-- reinstate typo in sidewalk ramps subtype
UPDATE
    moped_components
SET
    component_subtype = 'Rams'
WHERE
    component_name = 'Sidewalk'
    AND component_subtype = 'Ramps';
