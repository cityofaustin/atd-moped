-- Drop the current milestones and moped project tables
DROP TABLE "public"."moped_proj_milestones";
DROP TABLE "public"."moped_milestones";

-- Drop the milestone_id column from project
ALTER TABLE "public"."moped_project"
    DROP COLUMN "milestone_id";


-- Now we should be able to re-create them using old script

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
-- Name: moped_milestones milestone_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_milestones ALTER COLUMN milestone_id
    SET DEFAULT nextval('public.moped_milestones_milestone_id_seq'::regclass);


--
-- Name: moped_proj_phases project_phase_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_phases ALTER COLUMN project_phase_id
    SET DEFAULT nextval('public.moped_phase_history_project_milestone_id_seq'::regclass);




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
-- Name: moped_proj_milestones moped_milestone_history_milestone_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_milestone_history_milestone_name_fkey
        FOREIGN KEY (milestone_name) REFERENCES public.moped_milestones(milestone_name)
            ON UPDATE RESTRICT ON DELETE RESTRICT;

--
-- Name: moped_proj_milestones moped_milestone_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_milestone_history_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- Restore the values in moped_milestones for initial seed
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('actual construction start date', '', 7, true, 3);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('actual end date', '', 1, true, 4);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('actual resurfacing date', '', 8, true, 5);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('resurfacing date', '', 8, false, 9);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('check in on project status', '', 20, true, 10);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('public meeting', '', 21, true, 11);

-- Restore the values in moped_proj_milestones for initial seed
INSERT INTO public.moped_proj_milestones (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, days_left, is_current_milestone, completed, project_milestone_id, project_id, project_timeline_id, milestone_owner_id, date_added) VALUES ('check in on project status', '', 7, '2020-05-20', '2020-06-20', 30, true, 0, false, false, 1, 1, 1, NULL, '2020-10-09 14:35:56.695504+00');
INSERT INTO public.moped_proj_milestones (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, days_left, is_current_milestone, completed, project_milestone_id, project_id, project_timeline_id, milestone_owner_id, date_added) VALUES ('actual resurfacing date', NULL, 8, '2020-04-04', '2020-10-10', NULL, NULL, 65, true, false, 2, 2, NULL, NULL, '2020-10-09 14:35:56.695654+00');
INSERT INTO public.moped_proj_milestones (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, days_left, is_current_milestone, completed, project_milestone_id, project_id, project_timeline_id, milestone_owner_id, date_added) VALUES ('public meeting', NULL, 15, '2020-04-05', '2020-10-11', NULL, NULL, 66, true, false, 3, 3, NULL, NULL, '2020-10-09 14:35:56.695658+00');
