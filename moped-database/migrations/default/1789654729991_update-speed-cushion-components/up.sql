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


-- Retarget these projects' speed cushions at the new point types
update moped_proj_components mpc
set component_id = new_mc.component_id
from moped_components old_mc
join moped_components new_mc
    on new_mc.component_name = 'Speed Management'
    and new_mc.is_deleted = false
    and (
        (
            old_mc.component_subtype = 'Speed Cushions (Asphalt, linear)'
            and new_mc.component_subtype = 'Speed Cushions (Asphalt)'
        )
        or
        (
            old_mc.component_subtype = 'Speed Cushions (Rubber, linear)'
            and new_mc.component_subtype = 'Speed Cushions (Rubber)'
        )
    )
where mpc.component_id = old_mc.component_id
    and mpc.project_id in (
        277, 297, 299, 300, 301, 303, 474, 475, 477, 478, 574, 3568, 3570, 3574
    )
    and mpc.is_deleted = false;
-- One centroid MultiPoint per remaining drawn line, same parent component
insert into feature_drawn_points (
    component_id,
    geography,
    source_layer,
    project_extent_id,
    created_by_user_id,
    is_deleted
)
select
    fdl.component_id,
    st_multi(st_centroid(fdl.geography::geometry))::geography,
    'drawnByUserPoint',
    fdl.project_extent_id,
    fdl.created_by_user_id,
    false
from feature_drawn_lines fdl
join moped_proj_components mpc
    on mpc.project_component_id = fdl.component_id
join moped_components mc
    on mc.component_id = mpc.component_id
where mpc.project_id in (
        277, 297, 299, 300, 301, 303, 474, 475, 477, 478, 574, 3568, 3570, 3574
    )
    and mc.component_name = 'Speed Management'
    and mc.component_subtype in (
        'Speed Cushions (Asphalt)',
        'Speed Cushions (Rubber)'
    )
    and fdl.is_deleted = false
    and mpc.is_deleted = false;
-- Soft-delete the original drawn lines
update feature_drawn_lines fdl
set is_deleted = true
from moped_proj_components mpc
join moped_components mc
    on mc.component_id = mpc.component_id
where fdl.component_id = mpc.project_component_id
    and mpc.project_id in (
        277, 297, 299, 300, 301, 303, 474, 475, 477, 478, 574, 3568, 3570, 3574
    )
    and mc.component_name = 'Speed Management'
    and mc.component_subtype in (
        'Speed Cushions (Asphalt)',
        'Speed Cushions (Rubber)'
    )
    and fdl.is_deleted = false;