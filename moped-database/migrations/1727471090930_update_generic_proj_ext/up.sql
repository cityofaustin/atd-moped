UPDATE moped_components
SET component_name = 'Project Extent - Generic (linear)'
WHERE component_name = 'Project Extent - Generic' AND line_representation = true;

-- Insert new point component for generic project extent
INSERT INTO moped_components (component_name, line_representation, feature_layer_id)
VALUES ('Project Extent - Generic', false, 5);

-- Insert same work types for generic project extent point as exist for generic project extent line
WITH inserts_todo AS (
    SELECT
        mcwt.work_type_id AS work_type_id,
        mc.component_id AS component_id
    FROM
        moped_component_work_types AS mcwt,
        moped_components AS mc
    WHERE
        mcwt.component_id = 0
        AND mc.component_name = 'Project Extent - Generic'
)

INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    work_type_id,
    component_id
FROM
    inserts_todo
ON CONFLICT DO NOTHING;
