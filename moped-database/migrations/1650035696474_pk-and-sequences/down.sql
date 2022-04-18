ALTER TABLE moped_proj_fiscal_years DROP COLUMN id;

ALTER TABLE moped_fund_programs DROP CONSTRAINT moped_fund_programs_pkey;

ALTER TABLE moped_status ALTER COLUMN status_id SET default 0;
DROP SEQUENCE moped_status_status_id_seq;
CREATE SEQUENCE moped_status_status_id_seq AS INT INCREMENT BY 1 START WITH 13 OWNED BY moped_status.status_id; -- recreate the unused sequence..
ALTER TABLE moped_status ADD CONSTRAINT moped_status_status_id_key UNIQUE (status_id);

ALTER TABLE moped_phases ALTER COLUMN phase_id SET default 0;
DROP SEQUENCE moped_phases_phase_id_seq;
CREATE SEQUENCE moped_phases_phase_id_seq AS INT INCREMENT BY 1 START WITH 13 OWNED BY moped_phases.phase_id; -- recreate the unused sequence..
ALTER TABLE moped_phases ADD CONSTRAINT moped_phases_phase_id_key UNIQUE (phase_id);

ALTER TABLE moped_city_fiscal_years DROP CONSTRAINT moped_city_fiscal_years_pkey;
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id DROP NOT NULL; 
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id SET default NULL;
DROP SEQUENCE city_fiscal_years_id_seq;
UPDATE moped_city_fiscal_years set id = null where 1 = 1;
ALTER TABLE moped_city_fiscal_years ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (fiscal_year_value);
ALTER TABLE moped_city_fiscal_years DROP COLUMN id;
