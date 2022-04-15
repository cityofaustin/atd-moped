ALTER TABLE moped_city_fiscal_years DROP CONSTRAINT moped_city_fiscal_years_pkey;
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id DROP NOT NULL; 
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id SET default NULL; -- this is a non-op, but included to make a 1:1 alignment to the up.sql file
DROP SEQUENCE city_fiscal_years_id_seq;
UPDATE moped_city_fiscal_years set id = null where 1 = 1;
ALTER TABLE moped_city_fiscal_years ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (fiscal_year_value);
ALTER TABLE moped_city_fiscal_years DROP COLUMN id;