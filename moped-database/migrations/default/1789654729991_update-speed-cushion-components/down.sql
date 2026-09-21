-- Restore original drawn lines that were soft-deleted by the up migration
update feature_drawn_lines fdl
set is_deleted = false
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
    and fdl.is_deleted = true;

-- Remove council district rows created when centroid points were inserted
delete from features_council_districts fcd
using feature_drawn_points fdp
join moped_proj_components mpc
    on mpc.project_component_id = fdp.component_id
join moped_components mc
    on mc.component_id = mpc.component_id
where fcd.feature_id = fdp.id
    and fdp.source_layer = 'drawnByUserPoint'
    and mpc.project_id in (
        277, 297, 299, 300, 301, 303, 474, 475, 477, 478, 574, 3568, 3570, 3574
    )
    and mc.component_name = 'Speed Management'
    and mc.component_subtype in (
        'Speed Cushions (Asphalt)',
        'Speed Cushions (Rubber)'
    );

-- Delete centroid points created by the up migration
delete from feature_drawn_points fdp
using moped_proj_components mpc
join moped_components mc
    on mc.component_id = mpc.component_id
where fdp.component_id = mpc.project_component_id
    and fdp.source_layer = 'drawnByUserPoint'
    and mpc.project_id in (
        277, 297, 299, 300, 301, 303, 474, 475, 477, 478, 574, 3568, 3570, 3574
    )
    and mc.component_name = 'Speed Management'
    and mc.component_subtype in (
        'Speed Cushions (Asphalt)',
        'Speed Cushions (Rubber)'
    );

-- Retarget these projects' speed cushions back to the original linear types
update moped_proj_components mpc
set component_id = old_mc.component_id
from moped_components new_mc
join moped_components old_mc
    on old_mc.component_name = 'Speed Management'
    and old_mc.is_deleted = true
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
where mpc.component_id = new_mc.component_id
    and new_mc.component_name = 'Speed Management'
    and new_mc.is_deleted = false
    and mpc.project_id in (
        277, 297, 299, 300, 301, 303, 474, 475, 477, 478, 574, 3568, 3570, 3574
    )
    and mpc.is_deleted = false;

-- Remove work types copied onto the new point types
delete from moped_component_work_types mcwt
using moped_components mc
where mcwt.component_id = mc.component_id
    and mc.component_name = 'Speed Management'
    and mc.component_subtype in (
        'Speed Cushions (Asphalt)',
        'Speed Cushions (Rubber)'
    );

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
