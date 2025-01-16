-- This example finds existing project funding sources that are associated with the sources that merged
-- and updates them to the new funding source.
-- See https://github.com/cityofaustin/atd-moped/pull/1486
WITH funding_source_todos AS (
    SELECT funding_source_id AS ids
    FROM
        moped_fund_sources
    WHERE
        funding_source_name IN (
            'Austin Transportation',
            'Public Works'
        )
),

new_funding_source_row AS (
    SELECT funding_source_id AS id
    FROM
        moped_fund_sources
    WHERE
        funding_source_name = 'Austin Transportation and Public Works'
)

UPDATE
moped_proj_funding
SET
    funding_source_id = (SELECT id FROM new_funding_source_row)
WHERE
    funding_source_id IN (SELECT ids FROM funding_source_todos);
