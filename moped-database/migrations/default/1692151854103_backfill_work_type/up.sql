-- work type = new
WITH inserts_todo AS (
SELECT
    mpc.project_component_id,
    7 AS work_type_id,
    (
        SELECT
            COUNT(*)
        FROM
            moped_proj_component_work_types mpcwt
        WHERE
            mpc.project_component_id = mpcwt.project_component_id) AS count_work_types
    FROM
        moped_proj_components mpc
    LEFT JOIN project_list_view plv ON mpc.project_id = plv.project_id
    LEFT JOIN moped_components mc ON mc.component_id = mpc.component_id
WHERE
    mc.component_name LIKE 'Signal%'
    AND plv.type_name LIKE '%New')
INSERT INTO moped_proj_component_work_types (project_component_id, work_type_id)
SELECT
    project_component_id,
    work_type_id
FROM
    inserts_todo
WHERE
    count_work_types = 0;

-- work type = modification
WITH inserts_todo AS (
SELECT
    mpc.project_component_id,
    6 AS work_type_id,
    (
        SELECT
            COUNT(*)
        FROM
            moped_proj_component_work_types mpcwt
        WHERE
            mpc.project_component_id = mpcwt.project_component_id) AS count_work_types
    FROM
        moped_proj_components mpc
    LEFT JOIN project_list_view plv ON mpc.project_id = plv.project_id
    LEFT JOIN moped_components mc ON mc.component_id = mpc.component_id
WHERE
    mc.component_name LIKE 'Signal%'
    AND plv.type_name LIKE '%Mod')
INSERT INTO moped_proj_component_work_types (project_component_id, work_type_id)
SELECT
    project_component_id,
    work_type_id
FROM
    inserts_todo
WHERE
    count_work_types = 0;

-- work type = new (recommended traffic signals)
WITH inserts_todo AS (
    SELECT
        mpc.project_component_id,
        7 AS work_type_id,
        (
            SELECT
                COUNT(*)
            FROM
                moped_proj_component_work_types mpcwt
            WHERE
                mpc.project_component_id = mpcwt.project_component_id) AS count_work_types
        FROM
            moped_proj_components mpc
        LEFT JOIN project_list_view plv ON mpc.project_id = plv.project_id
        LEFT JOIN moped_components mc ON mc.component_id = mpc.component_id
    WHERE
        lower(project_name)
        LIKE '%recommended%'
        AND component_name = 'Intersection'
) INSERT INTO moped_proj_component_work_types (project_component_id, work_type_id)
SELECT
    project_component_id,
    work_type_id
FROM
    inserts_todo
WHERE
    count_work_types = 0;
