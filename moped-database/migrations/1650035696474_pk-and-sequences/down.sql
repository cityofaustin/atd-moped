ALTER TABLE moped_city_fiscal_years DROP CONSTRAINT moped_city_fiscal_years_pkey;
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id SET default NULL; 
DROP SEQUENCE city_fiscal_years_id_seq;
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id SET default NULL; -- this is a non-op, but included to make a 1:1 alignment to the up.sql file
UPDATE moped_city_fiscal_years set id = null;
ALTER TABLE moped_city_fiscal_years ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (fiscal_year_value);
ALTER TABLE moped_city_fiscal_years DROP COLUMN id;