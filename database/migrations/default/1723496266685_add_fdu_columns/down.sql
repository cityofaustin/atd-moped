-- Drop generated columns generated columns for fund_dept_unit and fund_name
ALTER TABLE moped_proj_funding DROP COLUMN IF EXISTS fund_dept_unit, DROP COLUMN IF EXISTS fund_name;
