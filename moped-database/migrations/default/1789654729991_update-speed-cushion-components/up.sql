update moped_components set
    component_subtype = 'Speed Cushions (Asphalt, linear)',
    is_deleted = true
where
    component_subtype = 'Speed Cushions (Asphalt)';

update moped_components set
    component_subtype = 'Speed Cushions (Rubber, linear)',
    is_deleted = true
where
    component_subtype = 'Speed Cushions (Rubber)';

insert into moped_components
(component_name, component_subtype, line_representation, feature_layer_id) values
('Speed Management', 'Speed Cushions (Asphalt)', false, 5);

insert into moped_components
(component_name, component_subtype, line_representation, feature_layer_id) values
('Speed Management', 'Speed Cushions (Rubber)', false, 5);
