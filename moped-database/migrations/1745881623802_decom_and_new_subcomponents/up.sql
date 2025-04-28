-- Insert new tag to mark decommissioned components
INSERT INTO moped_tags (name, type, slug) VALUES
('', 'Decommissioned / Upgraded Component', 'decommissioned_upgraded_component');

-- Update existing component tag name to include 'component' in name

-- Associate protection type subcomponents with Access Control components
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

-- Components
-- Access Control - Median
-- Access Control - Driveway Closure
-- Access Control - Driveway Modification
-- Access Control - Hardened Centerline
-- Subcomponents
-- Protection Type - Car free
-- Protection Type - Concrete
-- Protection Type - Concrete and on-street parking
-- Protection Type - Concrete traffic bump
-- Protection Type - Concrete with landscape
-- Protection Type - Flex posts
-- Protection Type - Flex posts (City Post)
-- Protection Type - Flex posts with curb stops
-- Protection Type - Flex posts with on-street parking
-- Protection Type - Planters
-- Protection Type - Raised & behind curb
-- Protection Type - ZICLA Barriers