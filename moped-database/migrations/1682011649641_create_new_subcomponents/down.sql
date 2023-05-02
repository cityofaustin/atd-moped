DELETE FROM moped_subcomponents where subcomponent_name = 'Continuous flow intersection';
DELETE FROM moped_subcomponents where subcomponent_name = 'Curb extension';
DELETE FROM moped_subcomponents where subcomponent_name = 'Detection - Bicycle';
DELETE FROM moped_subcomponents where subcomponent_name = 'Vehicle lane reconfiguration';
DELETE FROM moped_subcomponents where subcomponent_name = 'Protected intersection - Full';
DELETE FROM moped_subcomponents where subcomponent_name = 'Protected intersection - Full - Shared use';
DELETE FROM moped_subcomponents where subcomponent_name = 'Protected intersection - partial';
DELETE FROM moped_subcomponents where subcomponent_name = 'Radius tightening';
DELETE FROM moped_subcomponents where subcomponent_name = 'Slip lane removal';
DELETE FROM moped_subcomponents where subcomponent_name = 'Smart right';
DELETE FROM moped_subcomponents where subcomponent_name = 'Intersection square-up';
DELETE FROM moped_subcomponents where subcomponent_name = 'Transit corner modification';

UPDATE moped_subcomponents set subcomponent_name = 'Audible push button' where subcomponent_name = 'Accessible pedestrian signal (APS)';
