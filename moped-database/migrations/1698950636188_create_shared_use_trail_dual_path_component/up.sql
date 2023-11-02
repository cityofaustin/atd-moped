INSERT INTO moped_components (
    component_name,component_subtype,line_representation,feature_layer_id
) VALUES
    ('Trail', 'Shared Use Path (Paved Dual Trail)', TRUE, 4);

-- insert all "protection type" subcomponents into moped_components_subcomponents
WITH inserts_todo AS (
    SELECT
        subcomponent_id,
        'Trail' AS component_name,
        'Shared Use Path (Paved Dual Trail)' AS component_subtype
    FROM
        moped_subcomponents
    WHERE
        subcomponent_name LIKE 'Protection Type%'
) INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
SELECT
    mc.component_id, inserts_todo.subcomponent_id
FROM
    inserts_todo
    -- gets the component id of the new component we created
    LEFT JOIN moped_components mc ON mc.component_name = inserts_todo.component_name
        AND mc.component_subtype = inserts_todo.component_subtype;

-- insert all "protection type" subcomponents into moped_components_subcomponents
WITH inserts_todo AS (
    SELECT
        subcomponent_id,
        'Trail' AS component_name,
        'Shared Use Path (Paved Dual Trail)' AS component_subtype
    FROM
        moped_subcomponents
    WHERE
        subcomponent_name LIKE 'Protection Type%'
) INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
SELECT
    mc.component_id, inserts_todo.subcomponent_id
FROM
    inserts_todo
    -- gets the component id of the new component we created
    LEFT JOIN moped_components mc ON mc.component_name = inserts_todo.component_name
        AND mc.component_subtype = inserts_todo.component_subtype;

-- insert the same moped_component_work_types work types as the Trail - Shared Use Path (Paved) component
with inserts_todo as (SELECT
    work_type_id,
    'Trail' AS component_name,
    'Shared Use Path (Paved Dual Trail)' AS component_subtype
FROM
    moped_component_work_types mcwt
    LEFT JOIN moped_work_types mwt ON mwt.id = mcwt.work_type_id
    LEFT JOIN moped_components mc ON mc.component_id = mcwt.component_id
WHERE
    mc.component_subtype LIKE 'Shared Use Path (Paved)'
) INSERT INTO moped_component_work_types (component_id, work_type_id)
SELECT
    mc.component_id, inserts_todo.work_type_id
FROM
    inserts_todo
    -- gets the component id of the new component we created
    LEFT JOIN moped_components mc ON mc.component_name = inserts_todo.component_name
        AND mc.component_subtype = inserts_todo.component_subtype;
