INSERT INTO moped_subcomponents (subcomponent_name) values
    ('Continuous flow intersection'),
    ('Curb extension'),
    ('Detection - Bicycle'),
    ('Vehicle lane reconfiguration'),
    ('Protected intersection - Full'),
    ('Protected intersection - Full - Shared use'),
    ('Protected intersection - partial'),
    ('Radius tightening'),
    ('Slip lane removal'),
    ('Smart right'),
    ('Intersection square-up'),
    ('Transit corner modification')
    ('Bicycle accommodations at PHB'),
    ('Bicycle signal (standard signal + bicycle signal sign)'),
    ('Bicycle signal face (experiment)'),
    ('Bicycle signal face (interim approval)'),
    ('Detection - vehicle'),
    ('Leading bicycle interval'),
    ('Pedestrian signal head and pushbuttons'),
    ('Protected left turn phase'),
    ('Timing adjustment');

UPDATE moped_subcomponents set subcomponent_name = 'Accessible pedestrian signal (APS)' where subcomponent_name = 'Audible push button';
