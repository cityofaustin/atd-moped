SELECT
    setval('moped_fund_source_cat_funding_source_category_id_seq', (
            SELECT
                MAX(funding_program_id)
                FROM moped_fund_programs));

ALTER TABLE moped_fund_sources DROP COLUMN funding_source_category;

ALTER TABLE moped_fund_sources
    ADD COLUMN is_deleted boolean NOT NULL DEFAULT FALSE;

INSERT INTO moped_fund_sources (funding_source_name, is_deleted)
        values('2010 Bond', TRUE), ('CapMetro ILA 2018', FALSE);

ALTER TABLE moped_fund_programs
    ADD COLUMN is_deleted boolean NOT NULL DEFAULT FALSE;

INSERT INTO moped_fund_programs (funding_program_name)
        values('Large CIP'), ('Sidewalk Fee in Lieu'), ('Sidewalk Rehab'), ('Street Impact Fee'), ('Street Rehabilitation'), ('Traffic Mitigation Fees'), ('Transit Enhancement Program');

ALTER TABLE moped_funds
    ADD COLUMN is_deleted boolean NOT NULL DEFAULT FALSE;

ALTER TABLE moped_proj_funding DROP COLUMN fund_dept_unit;

ALTER TABLE moped_proj_funding ALTER COLUMN funding_status_id SET NOT NULL;
