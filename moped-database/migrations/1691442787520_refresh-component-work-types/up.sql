-- delete existing component work types
DELETE FROM moped_component_work_types WHERE 1 = 1;

-- for now, set new, mod, and maintenance as the allowed types for all components
WITH inserts_todo AS (
    SELECT
        id AS work_type_id,
        component_id
    FROM (
        values('new'),
            ('modification'),
            ('maintenance_repair')) AS data (work_type_key)
        LEFT JOIN moped_components ON TRUE
        LEFT JOIN moped_work_types mwt ON data.work_type_key = mwt.key
    WHERE
        moped_components.is_deleted = FALSE
) INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    *
FROM
    inserts_todo;
