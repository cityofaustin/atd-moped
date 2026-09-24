--
-- PostgreSQL database dump
--

--
-- Enable Required Extensions
--
create extension if not exists citext;
create extension if not exists "uuid-ossp";
create extension if not exists btree_gin;
create extension if not exists btree_gist;
create extension if not exists pgcrypto;
create extension if not exists postgis;

-- Dumped from database version 12.4 (Ubuntu 12.4-1.pgdg16.04+1)
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;



--
-- Name: moped_coa_staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_coa_staff (
    staff_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name name NOT NULL,
    last_name name NOT NULL,
    title text NOT NULL,
    workgroup text NOT NULL,
    staff_id integer NOT NULL,
    workgroup_id integer,
    cognito_user_id text,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_coa_staff; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_coa_staff IS 'Standardized list of city of Austin employees';


--
-- Name: coa_staff_full_name(public.moped_coa_staff); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.coa_staff_full_name(moped_coa_staff_row public.moped_coa_staff) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT moped_coa_staff_row.first_name || ' ' || moped_coa_staff.last_name
  FROM moped_coa_staff
$$;


--
-- Name: compute_phase_length(date, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.compute_phase_length(phase_start date, phase_end date) RETURNS integer
    LANGUAGE sql STABLE
    AS $$
SELECT
moped_phase_history.phase_end - moped_phase_history.phase_start
FROM moped_phase_history
$$;


--
-- Name: compute_project_length(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.compute_project_length() RETURNS integer
    LANGUAGE sql STABLE
    AS $$
SELECT
case when moped_project.end_date is null
then date(now()) - moped_project.start_date
else moped_project.end_date - moped_project.start_date
end as project_length
FROM moped_project
$$;


--
-- Name: day_diff(date, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.day_diff(day1 date, day2 date) RETURNS integer
    LANGUAGE sql STRICT
    AS $$select case when day2 is null
then date(now()) - day1
else day2 - day1
end $$;


--
-- Name: moped_proj_personnel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_personnel (
    join_date date,
    allocation integer,
    status text,
    project_id integer NOT NULL,
    project_personnel_user_id integer NOT NULL,
    project_personnel_id integer NOT NULL,
    first_name text,
    last_name text,
    workgroup_id integer NOT NULL,
    role_name text NOT NULL,
    role_order integer,
    date_added timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    added_by integer
);


--
-- Name: TABLE moped_proj_personnel; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_personnel IS 'Project Team members';


--
-- Name: proj_personnel_full_name(public.moped_proj_personnel); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.proj_personnel_full_name(moped_proj_personnel_row public.moped_proj_personnel) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT moped_proj_personnel_row.first_name || ' ' || moped_proj_personnel_row.last_name
$$;


--
-- Name: moped_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_categories (
    category_name text NOT NULL,
    category_id integer NOT NULL,
    active_category boolean DEFAULT true NOT NULL,
    on_street boolean,
    sensitivity boolean,
    category_order integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_categories; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_categories IS 'Standardized categories for projects';


--
-- Name: moped_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_categories_category_id_seq OWNED BY public.moped_categories.category_id;


--
-- Name: moped_city_fiscal_years; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_city_fiscal_years (
    fiscal_year_value text NOT NULL,
    fiscal_year_start_date date,
    fiscal_year_end_date date,
    active_fy boolean
);


--
-- Name: TABLE moped_city_fiscal_years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_city_fiscal_years IS 'Standardized fiscal years maintained by city';


--
-- Name: moped_coa_staff_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_coa_staff_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_coa_staff_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_coa_staff_staff_id_seq OWNED BY public.moped_coa_staff.staff_id;


--
-- Name: moped_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_components (
    component_id integer NOT NULL,
    component_name text NOT NULL,
    component_categories text,
    map_representation text NOT NULL,
    component_order integer,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_components; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_components IS 'Project facilities or components';


--
-- Name: moped_components_component_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_components_component_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_components_component_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_components_component_id_seq OWNED BY public.moped_components.component_id;


--
-- Name: moped_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_entity (
    entity_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    workgroup_name text NOT NULL,
    abbreviated_name text NOT NULL,
    entity_id integer NOT NULL,
    affiliated_workgroup integer,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_entity; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_entity IS 'Standardized list of project-related entities, including workgroups, COA partners, and sponsors';


--
-- Name: moped_entities_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_entities_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_entities_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_entities_entity_id_seq OWNED BY public.moped_entity.entity_id;


--
-- Name: moped_proj_financials; Type: TABLE; Schema: public; Owner: -
--

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
    last_updated timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_proj_financials; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_financials IS 'Financial data related to a project -- may be sourced from Moped or Controller''s Office or eCapris';


--
-- Name: moped_financials_financials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_financials_financials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_financials_financials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_financials_financials_id_seq OWNED BY public.moped_proj_financials.financials_id;


--
-- Name: moped_fund_opp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_fund_opp (
    funding_opportunity_id integer NOT NULL,
    funding_opportunity_name text NOT NULL,
    funding_source_cat text
);


--
-- Name: TABLE moped_fund_opp; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_fund_opp IS 'Standardized list of identified funding opportunities';


--
-- Name: moped_fund_opp_funding_opportunity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_fund_opp_funding_opportunity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_fund_opp_funding_opportunity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_fund_opp_funding_opportunity_id_seq OWNED BY public.moped_fund_opp.funding_opportunity_id;


--
-- Name: moped_fund_source_cat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_fund_source_cat (
    funding_source_category_id integer NOT NULL,
    funding_source_category_name text NOT NULL
);


--
-- Name: TABLE moped_fund_source_cat; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_fund_source_cat IS 'Standardized funding source categories';


--
-- Name: moped_fund_source_cat_funding_source_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_fund_source_cat_funding_source_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_fund_source_cat_funding_source_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_fund_source_cat_funding_source_category_id_seq OWNED BY public.moped_fund_source_cat.funding_source_category_id;


--
-- Name: moped_fund_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_fund_sources (
    funding_source_id integer NOT NULL,
    funding_source_name text NOT NULL,
    funding_source_category text NOT NULL
);


--
-- Name: TABLE moped_fund_sources; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_fund_sources IS 'Standardized funding sources for projects';


--
-- Name: moped_fund_sources_funding_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_fund_sources_funding_source_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_fund_sources_funding_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_fund_sources_funding_source_id_seq OWNED BY public.moped_fund_sources.funding_source_id;


--
-- Name: moped_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_group (
    group_id integer NOT NULL,
    group_name text NOT NULL
);


--
-- Name: TABLE moped_group; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_group IS 'Standardized list of COA groupings or initiatives';


--
-- Name: moped_groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_groups_group_id_seq OWNED BY public.moped_group.group_id;


--
-- Name: moped_proj_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_milestones (
    milestone_name text NOT NULL,
    milestone_description text,
    milestone_order integer NOT NULL,
    milestone_start date NOT NULL,
    milestone_end date NOT NULL,
    milestone_length integer,
    milestone_privacy boolean,
    days_left integer NOT NULL,
    is_current_milestone boolean NOT NULL,
    completed boolean NOT NULL,
    project_milestone_id integer NOT NULL,
    project_id integer NOT NULL,
    project_timeline_id integer,
    milestone_owner_id integer,
    date_added timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);


--
-- Name: moped_milestone_history_project_milestone_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_milestone_history_project_milestone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_milestone_history_project_milestone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_milestone_history_project_milestone_id_seq OWNED BY public.moped_proj_milestones.project_milestone_id;


--
-- Name: moped_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_milestones (
    milestone_name text NOT NULL,
    milestone_description text NOT NULL,
    milestone_order integer NOT NULL,
    required_milestone boolean NOT NULL,
    milestone_id integer NOT NULL
);


--
-- Name: TABLE moped_milestones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_milestones IS 'Standardized list of project milestones';


--
-- Name: moped_milestones_milestone_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_milestones_milestone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_milestones_milestone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_milestones_milestone_id_seq OWNED BY public.moped_milestones.milestone_id;


--
-- Name: moped_proj_phases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_phases (
    phase_name text NOT NULL,
    phase_description text,
    phase_rank integer,
    completion_percentage integer NOT NULL,
    phase_status text,
    phase_privacy boolean,
    phase_start date,
    phase_end date,
    phase_priority integer,
    is_current_phase boolean,
    completed boolean NOT NULL,
    project_phase_id integer NOT NULL,
    project_id integer NOT NULL,
    started_by_user_id integer,
    completed_by_user_id integer,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: moped_phase_history_project_milestone_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_phase_history_project_milestone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_phase_history_project_milestone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_phase_history_project_milestone_id_seq OWNED BY public.moped_proj_phases.project_phase_id;


--
-- Name: moped_phases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_phases (
    phase_name text NOT NULL,
    phase_description text,
    phase_rank integer,
    phase_average_length integer,
    required_phase boolean,
    phase_id integer NOT NULL
);


--
-- Name: TABLE moped_phases; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_phases IS 'Standardized list of project phases';


--
-- Name: moped_phases_phase_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_phases_phase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_phases_phase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_phases_phase_id_seq OWNED BY public.moped_phases.phase_id;


--
-- Name: moped_proj_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_categories (
    project_id integer NOT NULL,
    category_name text NOT NULL,
    proj_category_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_proj_categories; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_categories IS 'List of related project categories';


--
-- Name: moped_proj_categories_proj_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_categories_proj_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_categories_proj_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_categories_proj_category_id_seq OWNED BY public.moped_proj_categories.proj_category_id;


--
-- Name: moped_proj_communication; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_communication (
    project_memo text NOT NULL,
    pending_request date NOT NULL,
    pending_request_user character(1) NOT NULL,
    pending_review_date date NOT NULL,
    pending_review_user character(1) NOT NULL,
    last_note text NOT NULL,
    last_note_user character(1) NOT NULL,
    last_note_date date NOT NULL,
    channel_id character(1) NOT NULL,
    comm_id integer NOT NULL,
    project_id integer NOT NULL
);


--
-- Name: TABLE moped_proj_communication; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_communication IS 'Latest Project Communication';


--
-- Name: moped_proj_communication_comm_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_communication_comm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_communication_comm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_communication_comm_id_seq OWNED BY public.moped_proj_communication.comm_id;


--
-- Name: moped_proj_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_components (
    moped_project_id integer NOT NULL,
    moped_component_id integer NOT NULL,
    component_length numeric,
    component_notes text NOT NULL,
    component_unique_id text NOT NULL,
    component_unique_id_code text NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    moped_proj_component_id integer NOT NULL,
    added_by integer
);


--
-- Name: TABLE moped_proj_components; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_components IS 'Moped Project Components Table -- formerly facilities in Interim Project Database';


--
-- Name: moped_proj_components_moped_proj_component_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_components_moped_proj_component_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_components_moped_proj_component_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_components_moped_proj_component_id_seq OWNED BY public.moped_proj_components.moped_proj_component_id;


--
-- Name: moped_proj_dates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_dates (
    project_date date NOT NULL,
    date_type text NOT NULL,
    date_year integer NOT NULL,
    date_month integer NOT NULL,
    date_day integer NOT NULL,
    active_date boolean NOT NULL,
    date_id integer NOT NULL,
    project_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    project_milestone_id integer,
    project_phase_id integer,
    added_by integer
);


--
-- Name: TABLE moped_proj_dates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_dates IS 'List of associated project dates, likely from important project phases or milestones';


--
-- Name: moped_proj_dates_date_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_dates_date_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_dates_date_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_dates_date_id_seq OWNED BY public.moped_proj_dates.date_id;


--
-- Name: moped_proj_entities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_entities (
    project_sponsors text[] NOT NULL,
    project_groups character(1) NOT NULL,
    partners text[] NOT NULL,
    workgroups integer NOT NULL,
    project_personnel text[] NOT NULL,
    entity_list_id integer NOT NULL,
    project_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_proj_entities; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_entities IS 'List of entities related to a project, including internal and external groups';


--
-- Name: moped_proj_entities_entity_list_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_entities_entity_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_entities_entity_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_entities_entity_list_id_seq OWNED BY public.moped_proj_entities.entity_list_id;


--
-- Name: moped_proj_fiscal_years; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_fiscal_years (
    fiscal_year_name text NOT NULL,
    fiscal_year_start date NOT NULL,
    fiscal_year_end date NOT NULL,
    budget_total integer NOT NULL,
    expenses_total integer NOT NULL,
    budget_available_at_end integer NOT NULL,
    project_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_proj_fiscal_years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_fiscal_years IS 'Moped Project Fiscal Years';


--
-- Name: moped_proj_fund_opp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_fund_opp (
    fund_opp_id integer NOT NULL,
    fund_opp_name text NOT NULL,
    project_id integer NOT NULL,
    proj_fund_opp_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_proj_fund_opp; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_fund_opp IS 'Identified funding opportunities for a given project';


--
-- Name: moped_proj_fund_opp_fund_opp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_fund_opp_fund_opp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_fund_opp_fund_opp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_fund_opp_fund_opp_id_seq OWNED BY public.moped_proj_fund_opp.fund_opp_id;


--
-- Name: moped_proj_fund_opp_proj_fund_opp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_fund_opp_proj_fund_opp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_fund_opp_proj_fund_opp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_fund_opp_proj_fund_opp_id_seq OWNED BY public.moped_proj_fund_opp.proj_fund_opp_id;


--
-- Name: moped_proj_fund_source; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_fund_source (
    proj_fund_source_id integer NOT NULL,
    funding_source_name text NOT NULL,
    funding_source_category text NOT NULL,
    project_id integer NOT NULL,
    funding_source_other bpchar,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_proj_fund_source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_fund_source IS 'Main source for a project''s funding';


--
-- Name: moped_proj_fund_source_proj_fund_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_fund_source_proj_fund_source_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_fund_source_proj_fund_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_fund_source_proj_fund_source_id_seq OWNED BY public.moped_proj_fund_source.proj_fund_source_id;


--
-- Name: moped_proj_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_groups (
    group_name text NOT NULL,
    proj_group_id integer NOT NULL,
    project_id integer NOT NULL,
    group_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_proj_groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_groups IS 'moped_project_groups';


--
-- Name: moped_proj_groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_groups_group_id_seq OWNED BY public.moped_proj_groups.proj_group_id;


--
-- Name: moped_proj_location; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_location (
    location_name text NOT NULL,
    shape text,
    location_notes text NOT NULL,
    location_id integer NOT NULL,
    project_id integer NOT NULL,
    feature_id text
);


--
-- Name: TABLE moped_proj_location; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_location IS 'moped_project_location';


--
-- Name: moped_proj_location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_location_location_id_seq OWNED BY public.moped_proj_location.location_id;


--
-- Name: moped_proj_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_notes (
    project_note_id integer NOT NULL,
    project_note text NOT NULL,
    added_by bpchar,
    date_created timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    comm_id integer NOT NULL,
    project_id integer NOT NULL
);


--
-- Name: TABLE moped_proj_notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_notes IS 'moped_project_notes';


--
-- Name: moped_proj_notes_project_note_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_notes_project_note_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_notes_project_note_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_notes_project_note_id_seq OWNED BY public.moped_proj_notes.project_note_id;


--
-- Name: moped_proj_partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_partners (
    partner_name text NOT NULL,
    entity_id integer NOT NULL,
    proj_partner_id integer NOT NULL,
    project_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_proj_partners; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_partners IS 'moped_project_partners';


--
-- Name: moped_proj_partners_proj_partner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_partners_proj_partner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_partners_proj_partner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_partners_proj_partner_id_seq OWNED BY public.moped_proj_partners.proj_partner_id;


--
-- Name: moped_proj_personnel_project_personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_personnel_project_personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_personnel_project_personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_personnel_project_personnel_id_seq OWNED BY public.moped_proj_personnel.project_personnel_id;


--
-- Name: moped_proj_sponsors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_sponsors (
    sponsor_name text NOT NULL,
    sponsor_context text,
    sponsor_context_file text,
    date_added timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    project_sponsor_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    sponsor_description text,
    sponsor_website text,
    is_external_sponsor boolean,
    sponsor_allocation real,
    entity_id integer,
    project_id integer NOT NULL,
    added_by integer
);


--
-- Name: TABLE moped_proj_sponsors; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_sponsors IS 'All sponsors of a moped project regardless of city involvement';


--
-- Name: moped_proj_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_status_history (
    milestone_name text,
    milestone_description text,
    milestone_order integer,
    milestone_start date,
    milestone_end date,
    milestone_length integer,
    milestone_privacy boolean,
    is_current_milestone boolean,
    is_milestone_completed boolean,
    status_name text NOT NULL,
    project_status_history_id integer NOT NULL,
    date_status_changed date DEFAULT now(),
    project_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_proj_status_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_status_history IS 'List of status changes throughout a given project, including status changes brought about by milestones or phases';


--
-- Name: moped_proj_status_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_status_notes (
    status_note text NOT NULL,
    created_by_personnel text NOT NULL,
    date_written date NOT NULL,
    proj_status_id integer NOT NULL,
    project_id integer NOT NULL,
    status_name text,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer NOT NULL
);


--
-- Name: TABLE moped_proj_status_notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_status_notes IS 'List of notes tied to status changes in a given project';


--
-- Name: moped_proj_timeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_proj_timeline (
    active_phase text NOT NULL,
    active_phase_start date NOT NULL,
    active_phase_end date NOT NULL,
    active_phase_length integer NOT NULL,
    active_milestone_start date NOT NULL,
    active_milestone_end date NOT NULL,
    active_milestone_length integer NOT NULL,
    current_status text NOT NULL,
    capital_projects_explorer_id text NOT NULL,
    timeline_id integer NOT NULL,
    project_id integer NOT NULL,
    active_milestone text
);


--
-- Name: TABLE moped_proj_timeline; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_proj_timeline IS 'Most recent progress regarding a given project''s timeline (1:1 relationship with project)';


--
-- Name: moped_proj_timeline_timeline_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_proj_timeline_timeline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_proj_timeline_timeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_proj_timeline_timeline_id_seq OWNED BY public.moped_proj_timeline.timeline_id;


--
-- Name: moped_project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_project (
    project_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    project_name text NOT NULL,
    project_description text NOT NULL,
    project_description_public text,
    "eCapris_id" text,
    project_importance integer,
    project_order integer,
    current_status text,
    project_id integer NOT NULL,
    timeline_id integer,
    current_phase text,
    end_date date,
    project_length integer DEFAULT public.compute_project_length(),
    start_date date,
    fiscal_year text,
    capitally_funded boolean,
    project_priority integer,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


--
-- Name: TABLE moped_project; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_project IS 'Moped Project Table -- Parent entity of most in the database, primary key is foreign key for many entities';


--
-- Name: moped_project_project_id_simple_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_project_project_id_simple_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_project_project_id_simple_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_project_project_id_simple_seq OWNED BY public.moped_project.project_id;


--
-- Name: moped_project_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_project_roles (
    project_role_id integer NOT NULL,
    project_role_name text NOT NULL,
    active_role boolean DEFAULT true NOT NULL,
    role_order integer,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: TABLE moped_project_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_project_roles IS 'Project roles for project staffing selection';


--
-- Name: moped_project_roles_project_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_project_roles_project_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_project_roles_project_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_project_roles_project_role_id_seq OWNED BY public.moped_project_roles.project_role_id;


--
-- Name: moped_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_status (
    status_name text NOT NULL,
    status_flag integer,
    status_priority integer,
    status_id integer NOT NULL
);


--
-- Name: TABLE moped_status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.moped_status IS 'Standardized list of project statuses';


--
-- Name: moped_status_history_project_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_status_history_project_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_status_history_project_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_status_history_project_status_history_id_seq OWNED BY public.moped_proj_status_history.project_status_history_id;


--
-- Name: moped_status_notes_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_status_notes_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_status_notes_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_status_notes_status_id_seq OWNED BY public.moped_proj_status_notes.proj_status_id;


--
-- Name: moped_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_status_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_status_status_id_seq OWNED BY public.moped_status.status_id;


--
-- Name: moped_workgroup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moped_workgroup (
    workgroup_name text NOT NULL,
    workgroup_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);


--
-- Name: moped_workgroup_workgroup_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.moped_workgroup_workgroup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: moped_workgroup_workgroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.moped_workgroup_workgroup_id_seq OWNED BY public.moped_workgroup.workgroup_id;


--
-- Name: moped_categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_categories ALTER COLUMN category_id SET DEFAULT nextval('public.moped_categories_category_id_seq'::regclass);


--
-- Name: moped_coa_staff staff_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_coa_staff ALTER COLUMN staff_id SET DEFAULT nextval('public.moped_coa_staff_staff_id_seq'::regclass);


--
-- Name: moped_components component_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_components ALTER COLUMN component_id SET DEFAULT nextval('public.moped_components_component_id_seq'::regclass);


--
-- Name: moped_entity entity_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_entity ALTER COLUMN entity_id SET DEFAULT nextval('public.moped_entities_entity_id_seq'::regclass);


--
-- Name: moped_fund_opp funding_opportunity_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_opp ALTER COLUMN funding_opportunity_id SET DEFAULT nextval('public.moped_fund_opp_funding_opportunity_id_seq'::regclass);


--
-- Name: moped_fund_source_cat funding_source_category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_source_cat ALTER COLUMN funding_source_category_id SET DEFAULT nextval('public.moped_fund_source_cat_funding_source_category_id_seq'::regclass);


--
-- Name: moped_fund_sources funding_source_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_sources ALTER COLUMN funding_source_id SET DEFAULT nextval('public.moped_fund_sources_funding_source_id_seq'::regclass);


--
-- Name: moped_group group_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_group ALTER COLUMN group_id SET DEFAULT nextval('public.moped_groups_group_id_seq'::regclass);


--
-- Name: moped_milestones milestone_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_milestones ALTER COLUMN milestone_id SET DEFAULT nextval('public.moped_milestones_milestone_id_seq'::regclass);


--
-- Name: moped_proj_categories proj_category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_categories ALTER COLUMN proj_category_id SET DEFAULT nextval('public.moped_proj_categories_proj_category_id_seq'::regclass);


--
-- Name: moped_proj_communication comm_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_communication ALTER COLUMN comm_id SET DEFAULT nextval('public.moped_proj_communication_comm_id_seq'::regclass);


--
-- Name: moped_proj_components moped_proj_component_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components ALTER COLUMN moped_proj_component_id SET DEFAULT nextval('public.moped_proj_components_moped_proj_component_id_seq'::regclass);


--
-- Name: moped_proj_dates date_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_dates ALTER COLUMN date_id SET DEFAULT nextval('public.moped_proj_dates_date_id_seq'::regclass);


--
-- Name: moped_proj_entities entity_list_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_entities ALTER COLUMN entity_list_id SET DEFAULT nextval('public.moped_proj_entities_entity_list_id_seq'::regclass);


--
-- Name: moped_proj_financials financials_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_financials ALTER COLUMN financials_id SET DEFAULT nextval('public.moped_financials_financials_id_seq'::regclass);


--
-- Name: moped_proj_fund_opp proj_fund_opp_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_opp ALTER COLUMN proj_fund_opp_id SET DEFAULT nextval('public.moped_proj_fund_opp_proj_fund_opp_id_seq'::regclass);


--
-- Name: moped_proj_fund_source proj_fund_source_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_source ALTER COLUMN proj_fund_source_id SET DEFAULT nextval('public.moped_proj_fund_source_proj_fund_source_id_seq'::regclass);


--
-- Name: moped_proj_groups proj_group_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_groups ALTER COLUMN proj_group_id SET DEFAULT nextval('public.moped_proj_groups_group_id_seq'::regclass);


--
-- Name: moped_proj_location location_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_location ALTER COLUMN location_id SET DEFAULT nextval('public.moped_proj_location_location_id_seq'::regclass);


--
-- Name: moped_proj_notes project_note_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_notes ALTER COLUMN project_note_id SET DEFAULT nextval('public.moped_proj_notes_project_note_id_seq'::regclass);


--
-- Name: moped_proj_partners proj_partner_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_partners ALTER COLUMN proj_partner_id SET DEFAULT nextval('public.moped_proj_partners_proj_partner_id_seq'::regclass);


--
-- Name: moped_proj_personnel project_personnel_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_personnel ALTER COLUMN project_personnel_id SET DEFAULT nextval('public.moped_proj_personnel_project_personnel_id_seq'::regclass);


--
-- Name: moped_proj_phases project_phase_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_phases ALTER COLUMN project_phase_id SET DEFAULT nextval('public.moped_phase_history_project_milestone_id_seq'::regclass);


--
-- Name: moped_proj_status_history project_status_history_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_history ALTER COLUMN project_status_history_id SET DEFAULT nextval('public.moped_status_history_project_status_history_id_seq'::regclass);


--
-- Name: moped_proj_status_notes proj_status_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_notes ALTER COLUMN proj_status_id SET DEFAULT nextval('public.moped_status_notes_status_id_seq'::regclass);


--
-- Name: moped_proj_timeline timeline_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_timeline ALTER COLUMN timeline_id SET DEFAULT nextval('public.moped_proj_timeline_timeline_id_seq'::regclass);


--
-- Name: moped_project project_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project ALTER COLUMN project_id SET DEFAULT nextval('public.moped_project_project_id_simple_seq'::regclass);


--
-- Name: moped_project_roles project_role_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project_roles ALTER COLUMN project_role_id SET DEFAULT nextval('public.moped_project_roles_project_role_id_seq'::regclass);


--
-- Name: moped_workgroup workgroup_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_workgroup ALTER COLUMN workgroup_id SET DEFAULT nextval('public.moped_workgroup_workgroup_id_seq'::regclass);


--
-- Name: moped_categories moped_categories_category_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_categories
    ADD CONSTRAINT moped_categories_category_id_key UNIQUE (category_id);


--
-- Name: moped_categories moped_categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_categories
    ADD CONSTRAINT moped_categories_category_name_key UNIQUE (category_name);


--
-- Name: moped_categories moped_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_categories
    ADD CONSTRAINT moped_categories_pkey PRIMARY KEY (category_id);


--
-- Name: moped_city_fiscal_years moped_city_fiscal_years_fiscal_year_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_city_fiscal_years
    ADD CONSTRAINT moped_city_fiscal_years_fiscal_year_value_key UNIQUE (fiscal_year_value);


--
-- Name: moped_city_fiscal_years moped_city_fiscal_years_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_city_fiscal_years
    ADD CONSTRAINT moped_city_fiscal_years_pkey PRIMARY KEY (fiscal_year_value);


--
-- Name: moped_coa_staff moped_coa_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_coa_staff
    ADD CONSTRAINT moped_coa_staff_pkey PRIMARY KEY (staff_id);


--
-- Name: moped_coa_staff moped_coa_staff_staff_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_coa_staff
    ADD CONSTRAINT moped_coa_staff_staff_id_key UNIQUE (staff_id);


--
-- Name: moped_components moped_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_components
    ADD CONSTRAINT moped_components_pkey PRIMARY KEY (component_id);


--
-- Name: moped_entity moped_entities_entity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_entity
    ADD CONSTRAINT moped_entities_entity_id_key UNIQUE (entity_id);


--
-- Name: moped_entity moped_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_entity
    ADD CONSTRAINT moped_entity_pkey PRIMARY KEY (entity_id);


--
-- Name: moped_proj_financials moped_financials_financials_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_financials
    ADD CONSTRAINT moped_financials_financials_id_key UNIQUE (financials_id);


--
-- Name: moped_proj_financials moped_financials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_financials
    ADD CONSTRAINT moped_financials_pkey PRIMARY KEY (financials_id);


--
-- Name: moped_fund_opp moped_fund_opp_funding_opportunity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_opp
    ADD CONSTRAINT moped_fund_opp_funding_opportunity_id_key UNIQUE (funding_opportunity_id);


--
-- Name: moped_fund_opp moped_fund_opp_funding_opportunity_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_opp
    ADD CONSTRAINT moped_fund_opp_funding_opportunity_name_key UNIQUE (funding_opportunity_name);


--
-- Name: moped_fund_opp moped_fund_opp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_opp
    ADD CONSTRAINT moped_fund_opp_pkey PRIMARY KEY (funding_opportunity_id);


--
-- Name: moped_fund_source_cat moped_fund_source_cat_funding_source_category_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_source_cat
    ADD CONSTRAINT moped_fund_source_cat_funding_source_category_id_key UNIQUE (funding_source_category_id);


--
-- Name: moped_fund_source_cat moped_fund_source_cat_funding_source_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_source_cat
    ADD CONSTRAINT moped_fund_source_cat_funding_source_category_name_key UNIQUE (funding_source_category_name);


--
-- Name: moped_fund_sources moped_fund_sources_funding_source_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_sources
    ADD CONSTRAINT moped_fund_sources_funding_source_id_key UNIQUE (funding_source_id);


--
-- Name: moped_fund_sources moped_fund_sources_funding_source_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_sources
    ADD CONSTRAINT moped_fund_sources_funding_source_name_key UNIQUE (funding_source_name);


--
-- Name: moped_fund_sources moped_fund_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_sources
    ADD CONSTRAINT moped_fund_sources_pkey PRIMARY KEY (funding_source_id);


--
-- Name: moped_group moped_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_group
    ADD CONSTRAINT moped_groups_pkey PRIMARY KEY (group_id);


--
-- Name: moped_proj_milestones moped_milestone_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_milestone_history_pkey PRIMARY KEY (project_milestone_id);


--
-- Name: moped_proj_milestones moped_milestone_history_project_milestone_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_milestone_history_project_milestone_id_key UNIQUE (project_milestone_id);


--
-- Name: moped_milestones moped_milestones_milestone_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_milestones
    ADD CONSTRAINT moped_milestones_milestone_id_key UNIQUE (milestone_id);


--
-- Name: moped_milestones moped_milestones_milestone_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_milestones
    ADD CONSTRAINT moped_milestones_milestone_name_key UNIQUE (milestone_name);


--
-- Name: moped_milestones moped_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_milestones
    ADD CONSTRAINT moped_milestones_pkey PRIMARY KEY (milestone_id);


--
-- Name: moped_proj_phases moped_phase_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_phases
    ADD CONSTRAINT moped_phase_history_pkey PRIMARY KEY (project_phase_id);


--
-- Name: moped_proj_phases moped_phase_history_project_milestone_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_phases
    ADD CONSTRAINT moped_phase_history_project_milestone_id_key UNIQUE (project_phase_id);


--
-- Name: moped_phases moped_phases_phase_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_phases
    ADD CONSTRAINT moped_phases_phase_id_key UNIQUE (phase_id);


--
-- Name: moped_phases moped_phases_phase_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_phases
    ADD CONSTRAINT moped_phases_phase_name_key UNIQUE (phase_name);


--
-- Name: moped_phases moped_phases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_phases
    ADD CONSTRAINT moped_phases_pkey PRIMARY KEY (phase_id);


--
-- Name: moped_proj_categories moped_proj_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_categories
    ADD CONSTRAINT moped_proj_categories_pkey PRIMARY KEY (proj_category_id);


--
-- Name: moped_proj_communication moped_proj_communication_comm_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_comm_id_key UNIQUE (comm_id);


--
-- Name: moped_proj_communication moped_proj_communication_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_pkey PRIMARY KEY (comm_id);


--
-- Name: moped_proj_communication moped_proj_communication_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_components moped_proj_components_moped_proj_component_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_moped_proj_component_id_key UNIQUE (moped_proj_component_id);


--
-- Name: moped_proj_components moped_proj_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_pkey PRIMARY KEY (moped_component_id);


--
-- Name: moped_proj_dates moped_proj_dates_date_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_dates
    ADD CONSTRAINT moped_proj_dates_date_id_key UNIQUE (date_id);


--
-- Name: moped_proj_dates moped_proj_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_dates
    ADD CONSTRAINT moped_proj_dates_pkey PRIMARY KEY (date_id);


--
-- Name: moped_proj_entities moped_proj_entities_entity_list_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_entities
    ADD CONSTRAINT moped_proj_entities_entity_list_id_key UNIQUE (entity_list_id);


--
-- Name: moped_proj_entities moped_proj_entities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_entities
    ADD CONSTRAINT moped_proj_entities_pkey PRIMARY KEY (entity_list_id);


--
-- Name: moped_proj_financials moped_proj_financials_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_financials
    ADD CONSTRAINT moped_proj_financials_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_pkey PRIMARY KEY (proj_fund_opp_id);


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_proj_fund_opp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_proj_fund_opp_id_key UNIQUE (proj_fund_opp_id);


--
-- Name: moped_proj_fund_source moped_proj_fund_source_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_source
    ADD CONSTRAINT moped_proj_fund_source_pkey PRIMARY KEY (proj_fund_source_id);


--
-- Name: moped_proj_groups moped_proj_groups_group_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_group_id_key UNIQUE (proj_group_id);


--
-- Name: moped_proj_groups moped_proj_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_pkey PRIMARY KEY (proj_group_id);


--
-- Name: moped_proj_location moped_proj_location_location_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_location_id_key UNIQUE (location_id);


--
-- Name: moped_proj_location moped_proj_location_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_pkey PRIMARY KEY (location_id);


--
-- Name: moped_proj_location moped_proj_location_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_notes moped_proj_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_notes
    ADD CONSTRAINT moped_proj_notes_pkey PRIMARY KEY (project_note_id);


--
-- Name: moped_proj_notes moped_proj_notes_project_note_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_notes
    ADD CONSTRAINT moped_proj_notes_project_note_id_key UNIQUE (project_note_id);


--
-- Name: moped_proj_partners moped_proj_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_partners
    ADD CONSTRAINT moped_proj_partners_pkey PRIMARY KEY (proj_partner_id);


--
-- Name: moped_proj_partners moped_proj_partners_proj_partner_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_partners
    ADD CONSTRAINT moped_proj_partners_proj_partner_id_key UNIQUE (proj_partner_id);


--
-- Name: moped_proj_personnel moped_proj_personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_personnel
    ADD CONSTRAINT moped_proj_personnel_pkey PRIMARY KEY (project_personnel_id);


--
-- Name: moped_proj_personnel moped_proj_personnel_project_personnel_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_personnel
    ADD CONSTRAINT moped_proj_personnel_project_personnel_id_key UNIQUE (project_personnel_id);


--
-- Name: moped_proj_timeline moped_proj_timeline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_pkey PRIMARY KEY (timeline_id);


--
-- Name: moped_proj_timeline moped_proj_timeline_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_timeline moped_proj_timeline_timeline_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_timeline_id_key UNIQUE (timeline_id);


--
-- Name: moped_project moped_project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project
    ADD CONSTRAINT moped_project_pkey PRIMARY KEY (project_id);


--
-- Name: moped_project moped_project_project_id_simple_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project
    ADD CONSTRAINT moped_project_project_id_simple_key UNIQUE (project_id);


--
-- Name: moped_project_roles moped_project_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project_roles
    ADD CONSTRAINT moped_project_roles_pkey PRIMARY KEY (project_role_id);


--
-- Name: moped_project_roles moped_project_roles_project_role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project_roles
    ADD CONSTRAINT moped_project_roles_project_role_name_key UNIQUE (project_role_name);


--
-- Name: moped_proj_sponsors moped_project_sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_sponsors
    ADD CONSTRAINT moped_project_sponsors_pkey PRIMARY KEY (project_sponsor_id);


--
-- Name: moped_project moped_project_timeline_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_project
    ADD CONSTRAINT moped_project_timeline_id_key UNIQUE (timeline_id);


--
-- Name: moped_proj_status_history moped_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_status_history_pkey PRIMARY KEY (project_status_history_id);


--
-- Name: moped_proj_status_history moped_status_history_project_status_history_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_status_history_project_status_history_id_key UNIQUE (project_status_history_id);


--
-- Name: moped_proj_status_notes moped_status_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_notes
    ADD CONSTRAINT moped_status_notes_pkey PRIMARY KEY (proj_status_id);


--
-- Name: moped_proj_status_notes moped_status_notes_status_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_notes
    ADD CONSTRAINT moped_status_notes_status_id_key UNIQUE (proj_status_id);


--
-- Name: moped_status moped_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_status
    ADD CONSTRAINT moped_status_pkey PRIMARY KEY (status_id);


--
-- Name: moped_status moped_status_status_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_status
    ADD CONSTRAINT moped_status_status_id_key UNIQUE (status_id);


--
-- Name: moped_status moped_status_status_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_status
    ADD CONSTRAINT moped_status_status_name_key UNIQUE (status_name);


--
-- Name: moped_workgroup moped_workgroup_workgroup_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_workgroup
    ADD CONSTRAINT moped_workgroup_workgroup_id_key UNIQUE (workgroup_id);


--
-- Name: moped_coa_staff moped_coa_staff_workgroup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_coa_staff
    ADD CONSTRAINT moped_coa_staff_workgroup_id_fkey FOREIGN KEY (workgroup_id) REFERENCES public.moped_workgroup(workgroup_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_fund_sources moped_fund_sources_funding_source_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_fund_sources
    ADD CONSTRAINT moped_fund_sources_funding_source_category_fkey FOREIGN KEY (funding_source_category) REFERENCES public.moped_fund_source_cat(funding_source_category_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_milestones moped_milestone_history_milestone_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_milestone_history_milestone_name_fkey FOREIGN KEY (milestone_name) REFERENCES public.moped_milestones(milestone_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_milestones moped_milestone_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_milestone_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_phases moped_phase_history_phase_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_phases
    ADD CONSTRAINT moped_phase_history_phase_name_fkey FOREIGN KEY (phase_name) REFERENCES public.moped_phases(phase_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_phases moped_phase_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_phases
    ADD CONSTRAINT moped_phase_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_categories moped_proj_categories_category_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_categories
    ADD CONSTRAINT moped_proj_categories_category_name_fkey FOREIGN KEY (category_name) REFERENCES public.moped_categories(category_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_categories moped_proj_categories_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_categories
    ADD CONSTRAINT moped_proj_categories_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_communication moped_proj_communication_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_components moped_proj_components_moped_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_moped_component_id_fkey FOREIGN KEY (moped_component_id) REFERENCES public.moped_components(component_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_components moped_proj_components_moped_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_moped_project_id_fkey FOREIGN KEY (moped_project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_dates moped_proj_dates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_dates
    ADD CONSTRAINT moped_proj_dates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_entities moped_proj_entities_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_entities
    ADD CONSTRAINT moped_proj_entities_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_financials moped_proj_financials_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_financials
    ADD CONSTRAINT moped_proj_financials_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fiscal_years moped_proj_fiscal_years_fiscal_year_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fiscal_years
    ADD CONSTRAINT moped_proj_fiscal_years_fiscal_year_name_fkey FOREIGN KEY (fiscal_year_name) REFERENCES public.moped_city_fiscal_years(fiscal_year_value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fiscal_years moped_proj_fiscal_years_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fiscal_years
    ADD CONSTRAINT moped_proj_fiscal_years_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_fund_opp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_fund_opp_id_fkey FOREIGN KEY (fund_opp_id) REFERENCES public.moped_fund_opp(funding_opportunity_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_source moped_proj_fund_source_funding_source_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_source
    ADD CONSTRAINT moped_proj_fund_source_funding_source_category_fkey FOREIGN KEY (funding_source_category) REFERENCES public.moped_fund_source_cat(funding_source_category_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_source moped_proj_fund_source_funding_source_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_source
    ADD CONSTRAINT moped_proj_fund_source_funding_source_name_fkey FOREIGN KEY (funding_source_name) REFERENCES public.moped_fund_sources(funding_source_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_source moped_proj_fund_source_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_fund_source
    ADD CONSTRAINT moped_proj_fund_source_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_groups moped_proj_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.moped_group(group_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_groups moped_proj_groups_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_location moped_proj_location_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_notes moped_proj_notes_comm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_notes
    ADD CONSTRAINT moped_proj_notes_comm_id_fkey FOREIGN KEY (comm_id) REFERENCES public.moped_proj_communication(comm_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_notes moped_proj_notes_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_notes
    ADD CONSTRAINT moped_proj_notes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_partners moped_proj_partners_entity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_partners
    ADD CONSTRAINT moped_proj_partners_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.moped_entity(entity_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_partners moped_proj_partners_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_partners
    ADD CONSTRAINT moped_proj_partners_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_personnel moped_proj_personnel_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_personnel
    ADD CONSTRAINT moped_proj_personnel_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_sponsors moped_proj_sponsors_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_sponsors
    ADD CONSTRAINT moped_proj_sponsors_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_status_history moped_proj_status_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_proj_status_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_status_history moped_proj_status_history_project_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_proj_status_history_project_status_fkey FOREIGN KEY (status_name) REFERENCES public.moped_status(status_name) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_status_notes moped_proj_status_notes_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_status_notes
    ADD CONSTRAINT moped_proj_status_notes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_timeline moped_proj_timeline_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

