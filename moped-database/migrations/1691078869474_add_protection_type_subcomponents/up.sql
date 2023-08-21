INSERT INTO moped_subcomponents (subcomponent_name) values
    ('Protection Type - Car free'),
    ('Protection Type - Concrete'),
    ('Protection Type - Concrete and on-street parking'),
    ('Protection Type - Concrete traffic bump'),
    ('Protection Type - Concrete with landscape'),
    ('Protection Type - Flex posts'),
    ('Protection Type - Flex posts (City Post)'),
    ('Protection Type - Flex posts with curb stops'),
    ('Protection Type - Flex posts with on-street parking'),
    ('Protection Type - Planters'),
    ('Protection Type - Raised & behind curb');

WITH inserts_todo AS (
    SELECT
        component_id,
        subcomponent_id
    FROM
        moped_components
        JOIN moped_subcomponents ON TRUE
    WHERE
        lower(component_name)
        in('bike lane',
            'crossing island',
            'crosswalk',
            'intersection',
            'pedestrian',
            'sidewalk',
            'trail',
            'transit')
        AND lower(subcomponent_name)
        like('protection type%')
) INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
SELECT
    *
FROM
    inserts_todo;
