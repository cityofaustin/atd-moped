-- Add generated columns for fund_dept_unit and fund_name
ALTER TABLE moped_proj_funding
ADD COLUMN fund_dept_unit text GENERATED ALWAYS AS (
    coalesce(fund ->> 'fund_id', ' ') || ' ' || coalesce(dept_unit ->> 'dept', ' ') || ' ' || coalesce(dept_unit ->> 'unit', ' ')
) STORED,
ADD COLUMN fund_name text GENERATED ALWAYS AS (
    coalesce(fund ->> 'fund_name', ' ')
) STORED;
