-- This example inserts the same moped_component_work_types work types as the Trail - Shared Use Path (Paved) component
-- into the new Trail - Shared Use Path (Paved Dual Trail) component.
-- This is useful when creating a new component that is similar to an existing component.
-- See https://github.com/cityofaustin/atd-moped/pull/1191
WITH inserts_todo AS (
    SELECT
        work_type_id,
        'Trail' AS component_name,
        'Shared Use Path (Paved Dual Trail)' AS component_subtype
    FROM
        moped_component_work_types AS mcwt
    LEFT JOIN moped_work_types AS mwt ON mcwt.work_type_id = mwt.id
    LEFT JOIN moped_components AS mc ON mcwt.component_id = mc.component_id
    WHERE
        mc.component_subtype LIKE 'Shared Use Path (Paved)'
)

INSERT INTO moped_component_work_types (component_id, work_type_id)
SELECT
    mc.component_id,
    inserts_todo.work_type_id
FROM
    inserts_todo
    -- gets the component id of the new component we created
LEFT JOIN moped_components AS mc ON inserts_todo.component_name = mc.component_name
    AND inserts_todo.component_subtype = mc.component_subtype;
