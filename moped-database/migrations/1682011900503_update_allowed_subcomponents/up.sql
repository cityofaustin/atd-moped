DELETE FROM moped_components_subcomponents where 1=1;

WITH inserts_todo AS (SELECT
    mc.component_id component_id,
    ms.subcomponent_id subcomponent_id
FROM (VALUES
    ('Signal', 'PHB', 'Accessible pedestrian signal (APS)'),
    ('Signal', 'RRFB', 'Accessible pedestrian signal (APS)'),
    ('Signal', 'Traffic', 'Accessible pedestrian signal (APS)'),
    ('Signal', 'PHB', 'Bicycle accommodations at PHB'),
    ('Signal', 'Traffic', 'Bicycle signal (standard signal + bicycle signal sign)'),
    ('Signal', 'Traffic', 'Bicycle signal face (experiment)'),
    ('Signal', 'Traffic', 'Bicycle signal face (interim approval)'),
    ('Intersection', 'Improvement', 'Continuous flow intersection'),
    ('Intersection', 'Improvement', 'Curb extension'),
    ('Refuge Island', 'Bike', 'Curb extension'),
    ('Refuge Island', 'Bike/Ped', 'Curb extension'),
    ('Refuge Island', 'Ped', 'Curb extension'),
    ('Signal', 'PHB', 'Detection - Bicycle'),
    ('Signal', 'RRFB', 'Detection - Bicycle'),
    ('Signal', 'Traffic', 'Detection - Bicycle'),
    ('Signal', 'Traffic', 'Detection - Vehicle'),
    ('Intersection', 'Improvement', 'Intersection square-up'),
    ('Signal', 'Traffic', 'Leading bicycle interval'),
    ('Signal', 'Traffic', 'Leading pedestrian interval'),
    ('Signal', 'PHB', 'Pedestrian signal head and pushbuttons'),
    ('Intersection', 'Improvement', 'Protected intersection - Full'),
    ('Intersection', 'Improvement', 'Protected intersection - Full - Shared use'),
    ('Intersection', 'Improvement', 'Protected intersection - Partial'),
    ('Signal', 'Traffic', 'Protected left turn phase'),
    ('Intersection', 'Improvement', 'Radius tightening'),
    ('Intersection', 'Improvement', 'Slip lane removal'),
    ('Intersection', 'Improvement', 'Smart right'),
    ('Signal', 'PHB', 'Timing adjustment'),
    ('Signal', 'RRFB', 'Timing adjustment'),
    ('Signal', 'Traffic', 'Timing adjustment'),
    ('Intersection', 'Improvement', 'Transit corner modification'),
    ('Intersection', 'Improvement', 'Vehicle lane reconfiguration'),
    ('Transit', 'Bus Stop', 'Bus Stop Consolidation'),
    ('Transit', 'Bus Stop', 'Bus Stop Maintenance'),
    ('Transit', 'Bus Stop', 'Bus Stop Modification'),
    ('Transit', 'Bus Stop - Enhanced', 'Bikeway Direction - Two-way'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - Curbside with Bike Lane Bypass'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - Floating with Bike Lane'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - Island with Bike Lane Behind'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - Shared with Bike Lane in Front'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - Step-out with Shared Landing'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - With SUP Behind'),
    ('Transit', 'Bus Stop - Enhanced', 'Station Design - With SUP in Front')
  ) AS data (component_name, component_subtype, subcomponent_name)
        LEFT JOIN moped_components mc ON
            mc.component_name = data.component_name AND
            mc.component_subtype = data.component_subtype
        LEFT JOIN moped_subcomponents ms ON
            ms.subcomponent_name = data.subcomponent_name)
        INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
            select * from inserts_todo;
