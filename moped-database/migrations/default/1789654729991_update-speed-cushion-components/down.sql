delete from moped_components
where
    component_name = 'Speed Management'
    and component_subtype = 'Speed Cushions (Asphalt)';

delete from moped_components
where
    component_name = 'Speed Management'
    and component_subtype = 'Speed Cushions (Rubber)';

update moped_components set
    component_subtype = 'Speed Cushions (Asphalt)',
    is_deleted = false
where
    component_subtype = 'Speed Cushions (Asphalt, linear)';

update moped_components set
    component_subtype = 'Speed Cushions (Rubber)',
    is_deleted = false
where
    component_subtype = 'Speed Cushions (Rubber, linear)';
