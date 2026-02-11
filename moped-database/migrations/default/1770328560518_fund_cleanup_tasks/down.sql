-- Move moped_funds back to public schema
ALTER TABLE moped_funds SET SCHEMA public;

-- Not restoring generated fund_dept_unit and fund_name columns from moped_proj_funding since we won't restore the previous funding schema
-- that stored fund and dept_unit in jsonb. The generated columns picked values by keys to produce fund_name and merge fund and dept_unit.
-- fund_dept_unit was copied into current fdu column.
