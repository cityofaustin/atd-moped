ALTER TABLE moped_proj_work_activity ALTER COLUMN contract_amount SET DEFAULT 0;

UPDATE
    moped_proj_work_activity
SET
    contract_amount = 0
WHERE
    contract_amount IS NULL;
