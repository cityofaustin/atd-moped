ALTER TABLE moped_city_fiscal_years ADD COLUMN id integer;
ALTER TABLE moped_city_fiscal_years DROP CONSTRAINT moped_city_fiscal_years_pkey;
CREATE SEQUENCE city_fiscal_years_id_seq AS INT INCREMENT BY 1 START WITH 7 OWNED BY moped_city_fiscal_years.id;
