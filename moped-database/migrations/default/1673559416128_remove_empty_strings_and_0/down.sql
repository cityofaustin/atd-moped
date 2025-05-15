UPDATE moped_proj_funding SET fund_dept_unit = '' WHERE fund_dept_unit = null;
UPDATE moped_proj_funding SET funding_description = '' WHERE funding_description = null;
UPDATE moped_proj_funding SET funding_program_id = 0 WHERE funding_program_id = null;
UPDATE moped_proj_funding SET funding_amount = 0 WHERE funding_amount = null;

INSERT INTO moped_fund_programs (funding_program_id, funding_program_name) VALUES (0, '');
