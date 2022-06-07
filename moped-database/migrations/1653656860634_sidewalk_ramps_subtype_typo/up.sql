-- fix typo in sidewalk ramps subtype
UPDATE
    moped_components
SET
    component_subtype = 'Ramps'
WHERE
    component_name = 'Sidewalk'
    AND component_subtype = 'Rams';
