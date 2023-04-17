CREATE TABLE public.moped_city_fiscal_years (
    fiscal_year_value text NOT NULL,
    fiscal_year_start_date date,
    fiscal_year_end_date date,
    active_fy boolean
);

COMMENT ON TABLE public.moped_city_fiscal_years IS 'Standardized fiscal years maintained by city';

CREATE TABLE public.moped_proj_fiscal_years (
    fiscal_year_name text NOT NULL,
    fiscal_year_start date NOT NULL,
    fiscal_year_end date NOT NULL,
    budget_total integer NOT NULL,
    expenses_total integer NOT NULL,
    budget_available_at_end integer NOT NULL,
    project_id integer NOT NULL,
    date_added timestamp WITH time zone DEFAULT clock_timestamp(
)
);

COMMENT ON TABLE public.moped_proj_fiscal_years IS 'Moped Project Fiscal Years';

CREATE TABLE public.moped_proj_financials (
    subproject_name text NOT NULL,
    "eCapris_id" text NOT NULL,
    subproject_status text NOT NULL,
    budget_total double precision NOT NULL,
    expenses_total double precision NOT NULL,
    expenses_ytd double precision NOT NULL,
    expenses_previous double precision NOT NULL,
    budget_previous double precision NOT NULL,
    budget_available double precision NOT NULL,
    primary_funding_source text NOT NULL,
    financials_id integer NOT NULL,
    project_id integer NOT NULL,
    last_updated timestamp WITH time zone DEFAULT clock_timestamp(
)
);

COMMENT ON TABLE public.moped_proj_financials IS 'Financial data related to a project -- may be sourced from Moped or Controller''s Office or eCapris';
