DROP SEQUENCE moped_phases_phase_id_seq;
CREATE SEQUENCE moped_phases_phase_id_seq AS INT INCREMENT BY 1 START WITH 13 OWNED BY moped_phases.phase_id; -- recreate the unused sequence..
ALTER TABLE moped_phases ADD CONSTRAINT moped_phases UNIQUE (phase_id);

ALTER TABLE moped_city_fiscal_years DROP CONSTRAINT moped_city_fiscal_years_pkey;
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id DROP NOT NULL; 
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id SET default NULL;
DROP SEQUENCE city_fiscal_years_id_seq;
UPDATE moped_city_fiscal_years set id = null where 1 = 1;
ALTER TABLE moped_city_fiscal_years ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (fiscal_year_value);
ALTER TABLE moped_city_fiscal_years DROP COLUMN id;
