-- Add CSD and SMS workgroups
INSERT INTO
public.moped_workgroup (workgroup_name, department_id, workgroup_abbreviation)
VALUES
('Community Services Division', 11, 'CSD');

-- Update all TPWs to ATPWs in entity names
UPDATE moped_entity
SET
    entity_name = replace(entity_name, 'TPW', 'ATPW');

-- Update all TPWs to ATPWs in entity names
UPDATE moped_project_roles
SET
    project_role_description = replace(project_role_description, 'TPW', 'ATPW'),
    project_role_name = replace(project_role_name, 'TPW', 'ATPW');

-- Add MAP Mobility Hubs 2026 component tag
INSERT INTO public.moped_component_tags (type, name, slug) VALUES
('MAP Mobility Hubs', '2026', 'map_mobility_hubs_2026');

-- Add Mobility Hub component and component work types
INSERT INTO moped_components (component_name, component_subtype, line_representation, feature_layer_id)
VALUES (
    'Mobility Hub',
    NULL,
    FALSE,
    5
);

WITH inserts_todo AS (
    SELECT
        moped_component_work_types.work_type_id,
        'Mobility Hub' AS component_name
    FROM
        moped_component_work_types
    LEFT JOIN moped_work_types ON moped_component_work_types.work_type_id = moped_work_types.id
    LEFT JOIN moped_components ON moped_component_work_types.component_id = moped_components.component_id
    WHERE
        moped_components.component_subtype LIKE 'Shared Use Path (Paved)'
)

INSERT INTO moped_component_work_types (component_id, work_type_id)
SELECT
    moped_components.component_id,
    inserts_todo.work_type_id
FROM
    inserts_todo
    -- gets the component id of the new component we created
LEFT JOIN moped_components ON inserts_todo.component_name = moped_components.component_name;
