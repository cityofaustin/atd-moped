UPDATE moped_city_fiscal_years set id is null;
DROP SEQUENCE city_fiscal_years_id_seq;
ALTER TABLE moped_city_fiscal_years ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (fiscal_year_value);
ALTER TABLE moped_city_fiscal_years DROP COLUMN id;