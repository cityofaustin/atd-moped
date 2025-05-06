
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
-- Name: moped_proj_components moped_proj_components_moped_proj_component_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_moped_proj_component_id_key UNIQUE (moped_proj_component_id);


--
-- Name: moped_proj_components moped_proj_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_pkey PRIMARY KEY (moped_component_id);
