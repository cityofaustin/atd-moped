ALTER TABLE moped_proj_work_activity ALTER COLUMN contract_amount SET DEFAULT NULL;

UPDATE
    moped_proj_work_activity
SET
    contract_amount = NULL
WHERE
    contract_amount = 0;
