ALTER TABLE moped_project
    ADD COLUMN project_uuid uuid NOT NULL default gen_random_uuid(),
    ADD COLUMN project_description_public text,
    ADD COLUMN project_importance integer,
    ADD COLUMN project_order integer,
    ADD COLUMN timeline_id integer unique,
    ADD COLUMN end_date date,
    ADD COLUMN project_length integer,
    ADD COLUMN fiscal_year integer,
    ADD COLUMN project_priority text,
    ADD COLUMN milestone_id integer,
    ADD COLUMN work_assignment_id text;
