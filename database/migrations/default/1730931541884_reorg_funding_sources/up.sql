-- Insert new funding source and soft-delete existing funding sources that are merging into the new one
INSERT INTO "public"."moped_fund_sources" ("funding_source_name") VALUES
('Austin Transportation and Public Works');

UPDATE moped_fund_sources SET is_deleted = true WHERE funding_source_name IN ('Austin Transportation', 'Public Works');

-- Find existing project funding records that are associated with the funding sources that are merging
-- and update them to the new funding source called Austin Transportation and Public Works
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
