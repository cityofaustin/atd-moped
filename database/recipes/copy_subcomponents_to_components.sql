-- Associate protection type subcomponents with Access Control components
-- This is useful for batch inserting associations of multiple specific subcomponents 
-- with multiple specific components.
-- See https://github.com/cityofaustin/atd-moped/pull/1588
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
