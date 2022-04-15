ALTER TABLE moped_city_fiscal_years ADD COLUMN id integer;
ALTER TABLE moped_city_fiscal_years DROP CONSTRAINT moped_city_fiscal_years_pkey;
UPDATE moped_city_fiscal_years set id = fiscal_year_value::integer - 2015;
ALTER TABLE moped_city_fiscal_years ALTER COLUMN id SET NOT NULL;
CREATE SEQUENCE city_fiscal_years_id_seq AS INT INCREMENT BY 1 START WITH 7 OWNED BY moped_city_fiscal_years.id;



--ALTER TABLE moped_city_fiscal_years ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (id);