ALTER TABLE moped_fund_sources
    ADD COLUMN funding_source_category text;

ALTER TABLE moped_fund_sources DROP COLUMN is_deleted;

DELETE FROM moped_fund_sources where funding_source_name = '2010 Bond';

ALTER TABLE moped_fund_programs DROP COLUMN is_deleted;

DELETE FROM moped_fund_programs
WHERE funding_program_name in('Large CIP', 'Sidewalk Fee in Lieu', 'Sidewalk Rehab', 'Street Impact Fee', 'Street Rehabilitation', 'Traffic Mitigation Fees', 'Transit Enhancement Program');

ALTER TABLE moped_proj_funding ADD COLUMN fund_dept_unit text;

ALTER TABLE moped_proj_funding ALTER COLUMN funding_status_id DROP NOT NULL;

ALTER TABLE moped_funds
    DROP COLUMN is_deleted;
