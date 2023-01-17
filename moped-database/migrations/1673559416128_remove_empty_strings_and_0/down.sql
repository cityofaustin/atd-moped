UPDATE moped_proj_funding SET fund_dept_unit = '' WHERE fund_dept_unit = null;
UPDATE moped_proj_funding SET funding_description = '' WHERE funding_description = null;
UPDATE moped_proj_funding SET funding_program_id = 0 WHERE funding_program_id = null;
UPDATE moped_proj_funding SET funding_amount = 0 WHERE funding_amount = null;

-- delete moped_fund_programs program with id of 0
DELETE FROM moped_fund_programs WHERE funding_program_id = 0;
