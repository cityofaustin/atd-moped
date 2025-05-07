-- Add unique constraint to ensure no duplicate component/subcomponent associations
ALTER TABLE moped_components_subcomponents
ADD CONSTRAINT unique_component_subcomponents
UNIQUE (component_id, subcomponent_id);

COMMENT ON CONSTRAINT unique_component_subcomponents ON moped_components_subcomponents IS 'Ensures no duplicate component/subcomponent associations';

-- Alter moped_component_tags table to allow null names for new tags and updates to existing tags with empty names
ALTER TABLE moped_component_tags
ALTER COLUMN name DROP NOT NULL;

-- Insert new tag to mark decommissioned components
INSERT INTO moped_component_tags (name, type, slug) VALUES
('', 'Decommissioned / Upgraded Component', 'decommissioned_upgraded_component');

-- Update existing component tag from 'Bikeways - Performance Measure - Upgrades Existing` to
-- 'Upgrades Existing Component'
UPDATE moped_component_tags SET name = '', type = 'Upgrades Existing Component', slug = 'upgrades_existing_component'
WHERE slug = 'bikeways_performance_measure_upgrades_existing';

-- Associate protection type subcomponents with Access Control components
-- The CTE produces all combinations of defined components and subcomponents IDs
WITH
inserts_todo AS (
    SELECT
        moped_components.component_id,
        moped_subcomponents.subcomponent_id
    FROM
        moped_components
    CROSS JOIN moped_subcomponents
    WHERE
        moped_components.component_name_full IN ('Access Control - Median', 'Access Control - Driveway Closure', 'Access Control - Driveway Modification', 'Access Control - Hardened Centerline')
        AND moped_subcomponents.subcomponent_name IN (
            'Protection Type - Car free',
            'Protection Type - Concrete',
            'Protection Type - Concrete and on-street parking',
            'Protection Type - Concrete traffic bump',
            'Protection Type - Concrete with landscape',
            'Protection Type - Flex posts',
            'Protection Type - Flex posts (City Post)',
            'Protection Type - Flex posts with curb stops',
            'Protection Type - Flex posts with on-street parking',
            'Protection Type - Planters',
            'Protection Type - Raised & behind curb',
            'Protection Type - ZICLA Barriers'
        )
)

INSERT INTO
moped_components_subcomponents (component_id, subcomponent_id)
SELECT
    inserts_todo.component_id,
    inserts_todo.subcomponent_id
FROM
    inserts_todo;
