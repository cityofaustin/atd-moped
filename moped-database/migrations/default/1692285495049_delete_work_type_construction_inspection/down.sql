INSERT INTO moped_work_types (name, key) VALUES 
    ('Construction Inspection', 'construction_inspection');

-- add as allowed work type for signal components
-- see 1691442787520_refresh-component-work-types
WITH inserts_todo AS (
    SELECT
        id AS work_type_id,
        component_id
    FROM (
        values('construction_inspection')) AS data (work_type_key)
        LEFT JOIN moped_components ON TRUE
        LEFT JOIN moped_work_types mwt ON data.work_type_key = mwt.key
    WHERE
        moped_components.is_deleted = FALSE
        AND lower(moped_components.component_name) = 'signal'
        AND(lower(moped_components.component_subtype) = 'traffic'
            OR lower(moped_components.component_subtype) = 'phb')
) INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    *
FROM
    inserts_todo;
