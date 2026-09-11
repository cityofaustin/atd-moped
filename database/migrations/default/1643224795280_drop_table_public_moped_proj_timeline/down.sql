--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 12.9 (Debian 12.9-1.pgdg110+1)


--
-- Name: moped_fund_opp; Type: TABLE; Schema: public; Owner: moped
--

CREATE TABLE public.moped_fund_opp (
    funding_opportunity_id integer NOT NULL,
    funding_opportunity_name text NOT NULL,
    funding_source_cat text
);


ALTER TABLE public.moped_fund_opp OWNER TO moped;

--
-- Name: TABLE moped_fund_opp; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_fund_opp IS 'Standardized list of identified funding opportunities';


--
-- Name: moped_fund_opp_funding_opportunity_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_fund_opp_funding_opportunity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_fund_opp_funding_opportunity_id_seq OWNER TO moped;

--
-- Name: moped_fund_opp_funding_opportunity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_fund_opp_funding_opportunity_id_seq OWNED BY public.moped_fund_opp.funding_opportunity_id;


--
-- Name: moped_group; Type: TABLE; Schema: public; Owner: moped
--

CREATE TABLE public.moped_group (
    group_id integer NOT NULL,
    group_name text NOT NULL
);


ALTER TABLE public.moped_group OWNER TO moped;

--
-- Name: TABLE moped_group; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_group IS 'Standardized list of COA groupings or initiatives';


--
-- Name: moped_groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_groups_group_id_seq OWNER TO moped;

--
-- Name: moped_groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_groups_group_id_seq OWNED BY public.moped_group.group_id;


--
-- Name: moped_proj_communication; Type: TABLE; Schema: public; Owner: moped
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


ALTER TABLE public.moped_proj_communication OWNER TO moped;

--
-- Name: TABLE moped_proj_communication; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_communication IS 'Latest Project Communication';


--
-- Name: moped_proj_communication_comm_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_communication_comm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_communication_comm_id_seq OWNER TO moped;

--
-- Name: moped_proj_communication_comm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_communication_comm_id_seq OWNED BY public.moped_proj_communication.comm_id;


--
-- Name: moped_proj_dates; Type: TABLE; Schema: public; Owner: moped
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


ALTER TABLE public.moped_proj_dates OWNER TO moped;

--
-- Name: TABLE moped_proj_dates; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_dates IS 'List of associated project dates, likely from important project phases or milestones';


--
-- Name: moped_proj_dates_date_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_dates_date_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_dates_date_id_seq OWNER TO moped;

--
-- Name: moped_proj_dates_date_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_dates_date_id_seq OWNED BY public.moped_proj_dates.date_id;


--
-- Name: moped_proj_fund_opp; Type: TABLE; Schema: public; Owner: moped
--

CREATE TABLE public.moped_proj_fund_opp (
    fund_opp_id integer NOT NULL,
    fund_opp_name text NOT NULL,
    project_id integer NOT NULL,
    proj_fund_opp_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


ALTER TABLE public.moped_proj_fund_opp OWNER TO moped;

--
-- Name: TABLE moped_proj_fund_opp; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_fund_opp IS 'Identified funding opportunities for a given project';


--
-- Name: moped_proj_fund_opp_fund_opp_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_fund_opp_fund_opp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_fund_opp_fund_opp_id_seq OWNER TO moped;

--
-- Name: moped_proj_fund_opp_fund_opp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_fund_opp_fund_opp_id_seq OWNED BY public.moped_proj_fund_opp.fund_opp_id;


--
-- Name: moped_proj_fund_opp_proj_fund_opp_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_fund_opp_proj_fund_opp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_fund_opp_proj_fund_opp_id_seq OWNER TO moped;

--
-- Name: moped_proj_fund_opp_proj_fund_opp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_fund_opp_proj_fund_opp_id_seq OWNED BY public.moped_proj_fund_opp.proj_fund_opp_id;


--
-- Name: moped_proj_groups; Type: TABLE; Schema: public; Owner: moped
--

CREATE TABLE public.moped_proj_groups (
    group_name text NOT NULL,
    proj_group_id integer NOT NULL,
    project_id integer NOT NULL,
    group_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);


ALTER TABLE public.moped_proj_groups OWNER TO moped;

--
-- Name: TABLE moped_proj_groups; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_groups IS 'moped_project_groups';


--
-- Name: moped_proj_groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_groups_group_id_seq OWNER TO moped;

--
-- Name: moped_proj_groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_groups_group_id_seq OWNED BY public.moped_proj_groups.proj_group_id;


--
-- Name: moped_proj_location; Type: TABLE; Schema: public; Owner: moped
--

CREATE TABLE public.moped_proj_location (
    location_name text NOT NULL,
    shape text,
    location_notes text NOT NULL,
    location_id integer NOT NULL,
    project_id integer NOT NULL,
    feature_id text
);


ALTER TABLE public.moped_proj_location OWNER TO moped;

--
-- Name: TABLE moped_proj_location; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_location IS 'moped_project_location';


--
-- Name: moped_proj_location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_location_location_id_seq OWNER TO moped;

--
-- Name: moped_proj_location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_location_location_id_seq OWNED BY public.moped_proj_location.location_id;


--
-- Name: moped_proj_status_history; Type: TABLE; Schema: public; Owner: moped
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


ALTER TABLE public.moped_proj_status_history OWNER TO moped;

--
-- Name: TABLE moped_proj_status_history; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_status_history IS 'List of status changes throughout a given project, including status changes brought about by milestones or phases';


--
-- Name: moped_proj_status_notes; Type: TABLE; Schema: public; Owner: moped
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


ALTER TABLE public.moped_proj_status_notes OWNER TO moped;

--
-- Name: TABLE moped_proj_status_notes; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_status_notes IS 'List of notes tied to status changes in a given project';


--
-- Name: moped_proj_timeline; Type: TABLE; Schema: public; Owner: moped
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


ALTER TABLE public.moped_proj_timeline OWNER TO moped;

--
-- Name: TABLE moped_proj_timeline; Type: COMMENT; Schema: public; Owner: moped
--

COMMENT ON TABLE public.moped_proj_timeline IS 'Most recent progress regarding a given project''s timeline (1:1 relationship with project)';


--
-- Name: moped_proj_timeline_timeline_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_proj_timeline_timeline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_proj_timeline_timeline_id_seq OWNER TO moped;

--
-- Name: moped_proj_timeline_timeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_proj_timeline_timeline_id_seq OWNED BY public.moped_proj_timeline.timeline_id;


--
-- Name: moped_status_history_project_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_status_history_project_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_status_history_project_status_history_id_seq OWNER TO moped;

--
-- Name: moped_status_history_project_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_status_history_project_status_history_id_seq OWNED BY public.moped_proj_status_history.project_status_history_id;


--
-- Name: moped_status_notes_status_id_seq; Type: SEQUENCE; Schema: public; Owner: moped
--

CREATE SEQUENCE public.moped_status_notes_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moped_status_notes_status_id_seq OWNER TO moped;

--
-- Name: moped_status_notes_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moped
--

ALTER SEQUENCE public.moped_status_notes_status_id_seq OWNED BY public.moped_proj_status_notes.proj_status_id;


--
-- Name: moped_fund_opp funding_opportunity_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_fund_opp ALTER COLUMN funding_opportunity_id SET DEFAULT nextval('public.moped_fund_opp_funding_opportunity_id_seq'::regclass);


--
-- Name: moped_group group_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_group ALTER COLUMN group_id SET DEFAULT nextval('public.moped_groups_group_id_seq'::regclass);


--
-- Name: moped_proj_communication comm_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_communication ALTER COLUMN comm_id SET DEFAULT nextval('public.moped_proj_communication_comm_id_seq'::regclass);


--
-- Name: moped_proj_dates date_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_dates ALTER COLUMN date_id SET DEFAULT nextval('public.moped_proj_dates_date_id_seq'::regclass);


--
-- Name: moped_proj_fund_opp proj_fund_opp_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_fund_opp ALTER COLUMN proj_fund_opp_id SET DEFAULT nextval('public.moped_proj_fund_opp_proj_fund_opp_id_seq'::regclass);


--
-- Name: moped_proj_groups proj_group_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_groups ALTER COLUMN proj_group_id SET DEFAULT nextval('public.moped_proj_groups_group_id_seq'::regclass);


--
-- Name: moped_proj_location location_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_location ALTER COLUMN location_id SET DEFAULT nextval('public.moped_proj_location_location_id_seq'::regclass);


--
-- Name: moped_proj_status_history project_status_history_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_history ALTER COLUMN project_status_history_id SET DEFAULT nextval('public.moped_status_history_project_status_history_id_seq'::regclass);


--
-- Name: moped_proj_status_notes proj_status_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_notes ALTER COLUMN proj_status_id SET DEFAULT nextval('public.moped_status_notes_status_id_seq'::regclass);


--
-- Name: moped_proj_timeline timeline_id; Type: DEFAULT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_timeline ALTER COLUMN timeline_id SET DEFAULT nextval('public.moped_proj_timeline_timeline_id_seq'::regclass);


--
-- Data for Name: moped_fund_opp; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_fund_opp (funding_opportunity_id, funding_opportunity_name, funding_source_cat) FROM stdin;
\.


--
-- Data for Name: moped_group; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_group (group_id, group_name) FROM stdin;
\.


--
-- Data for Name: moped_proj_communication; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_communication (project_memo, pending_request, pending_request_user, pending_review_date, pending_review_user, last_note, last_note_user, last_note_date, channel_id, comm_id, project_id) FROM stdin;
\.


--
-- Data for Name: moped_proj_dates; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_dates (project_date, date_type, date_year, date_month, date_day, active_date, date_id, project_id, date_added, project_milestone_id, project_phase_id, added_by) FROM stdin;
\.


--
-- Data for Name: moped_proj_fund_opp; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_fund_opp (fund_opp_id, fund_opp_name, project_id, proj_fund_opp_id, date_added, added_by) FROM stdin;
\.


--
-- Data for Name: moped_proj_groups; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_groups (group_name, proj_group_id, project_id, group_id, date_added, added_by) FROM stdin;
\.


--
-- Data for Name: moped_proj_location; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_location (location_name, shape, location_notes, location_id, project_id, feature_id) FROM stdin;
\.


--
-- Data for Name: moped_proj_status_history; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_status_history (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, is_current_milestone, is_milestone_completed, status_name, project_status_history_id, date_status_changed, project_id, date_added, added_by) FROM stdin;
\.


--
-- Data for Name: moped_proj_status_notes; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_status_notes (status_note, created_by_personnel, date_written, proj_status_id, project_id, status_name, date_added, added_by) FROM stdin;
\.


--
-- Data for Name: moped_proj_timeline; Type: TABLE DATA; Schema: public; Owner: moped
--

COPY public.moped_proj_timeline (active_phase, active_phase_start, active_phase_end, active_phase_length, active_milestone_start, active_milestone_end, active_milestone_length, current_status, capital_projects_explorer_id, timeline_id, project_id, active_milestone) FROM stdin;
\.


--
-- Name: moped_fund_opp_funding_opportunity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_fund_opp_funding_opportunity_id_seq', 1, false);


--
-- Name: moped_groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_groups_group_id_seq', 1, false);


--
-- Name: moped_proj_communication_comm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_communication_comm_id_seq', 1, false);


--
-- Name: moped_proj_dates_date_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_dates_date_id_seq', 1, false);


--
-- Name: moped_proj_fund_opp_fund_opp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_fund_opp_fund_opp_id_seq', 1, false);


--
-- Name: moped_proj_fund_opp_proj_fund_opp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_fund_opp_proj_fund_opp_id_seq', 1, false);


--
-- Name: moped_proj_groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_groups_group_id_seq', 1, false);


--
-- Name: moped_proj_location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_location_location_id_seq', 1, false);


--
-- Name: moped_proj_timeline_timeline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_timeline_timeline_id_seq', 1, false);


--
-- Name: moped_status_history_project_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_status_history_project_status_history_id_seq', 6, true);


--
-- Name: moped_status_notes_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_status_notes_status_id_seq', 1, false);


--
-- Name: moped_fund_opp moped_fund_opp_funding_opportunity_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_fund_opp
    ADD CONSTRAINT moped_fund_opp_funding_opportunity_id_key UNIQUE (funding_opportunity_id);


--
-- Name: moped_fund_opp moped_fund_opp_funding_opportunity_name_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_fund_opp
    ADD CONSTRAINT moped_fund_opp_funding_opportunity_name_key UNIQUE (funding_opportunity_name);


--
-- Name: moped_fund_opp moped_fund_opp_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_fund_opp
    ADD CONSTRAINT moped_fund_opp_pkey PRIMARY KEY (funding_opportunity_id);


--
-- Name: moped_group moped_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_group
    ADD CONSTRAINT moped_groups_pkey PRIMARY KEY (group_id);


--
-- Name: moped_proj_communication moped_proj_communication_comm_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_comm_id_key UNIQUE (comm_id);


--
-- Name: moped_proj_communication moped_proj_communication_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_pkey PRIMARY KEY (comm_id);


--
-- Name: moped_proj_communication moped_proj_communication_project_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_dates moped_proj_dates_date_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_dates
    ADD CONSTRAINT moped_proj_dates_date_id_key UNIQUE (date_id);


--
-- Name: moped_proj_dates moped_proj_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_dates
    ADD CONSTRAINT moped_proj_dates_pkey PRIMARY KEY (date_id);


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_pkey PRIMARY KEY (proj_fund_opp_id);


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_proj_fund_opp_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_proj_fund_opp_id_key UNIQUE (proj_fund_opp_id);


--
-- Name: moped_proj_groups moped_proj_groups_group_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_group_id_key UNIQUE (proj_group_id);


--
-- Name: moped_proj_groups moped_proj_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_pkey PRIMARY KEY (proj_group_id);


--
-- Name: moped_proj_location moped_proj_location_location_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_location_id_key UNIQUE (location_id);


--
-- Name: moped_proj_location moped_proj_location_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_pkey PRIMARY KEY (location_id);


--
-- Name: moped_proj_location moped_proj_location_project_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_timeline moped_proj_timeline_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_pkey PRIMARY KEY (timeline_id);


--
-- Name: moped_proj_timeline moped_proj_timeline_project_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_project_id_key UNIQUE (project_id);


--
-- Name: moped_proj_timeline moped_proj_timeline_timeline_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_timeline_id_key UNIQUE (timeline_id);


--
-- Name: moped_proj_status_history moped_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_status_history_pkey PRIMARY KEY (project_status_history_id);


--
-- Name: moped_proj_status_history moped_status_history_project_status_history_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_status_history_project_status_history_id_key UNIQUE (project_status_history_id);


--
-- Name: moped_proj_status_notes moped_status_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_notes
    ADD CONSTRAINT moped_status_notes_pkey PRIMARY KEY (proj_status_id);


--
-- Name: moped_proj_status_notes moped_status_notes_status_id_key; Type: CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_notes
    ADD CONSTRAINT moped_status_notes_status_id_key UNIQUE (proj_status_id);


--
-- Name: moped_proj_communication moped_proj_communication_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_communication
    ADD CONSTRAINT moped_proj_communication_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_dates moped_proj_dates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_dates
    ADD CONSTRAINT moped_proj_dates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_fund_opp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_fund_opp_id_fkey FOREIGN KEY (fund_opp_id) REFERENCES public.moped_fund_opp(funding_opportunity_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_fund_opp moped_proj_fund_opp_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_fund_opp
    ADD CONSTRAINT moped_proj_fund_opp_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_groups moped_proj_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.moped_group(group_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_groups moped_proj_groups_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_groups
    ADD CONSTRAINT moped_proj_groups_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_location moped_proj_location_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_location
    ADD CONSTRAINT moped_proj_location_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_status_history moped_proj_status_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_history
    ADD CONSTRAINT moped_proj_status_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_status_notes moped_proj_status_notes_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_status_notes
    ADD CONSTRAINT moped_proj_status_notes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: moped_proj_timeline moped_proj_timeline_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moped
--

ALTER TABLE ONLY public.moped_proj_timeline
    ADD CONSTRAINT moped_proj_timeline_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

