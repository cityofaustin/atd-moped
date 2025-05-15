-- Drop the current milestones
DROP TABLE "public"."moped_proj_milestones";
DROP TABLE "public"."moped_milestones";


-- Add current milestone id
ALTER TABLE "public"."moped_project"
    ADD COLUMN "milestone_id" integer NULL;


-- Creates a new index for milestone_id at the moped_project table
CREATE INDEX moped_project_milestone_id_index
    ON moped_project (milestone_id);

-- Create moped_milestones table
CREATE TABLE moped_milestones(
     milestone_id serial not null
         constraint moped_milestones_milestone_id_pkey
             primary key
         constraint moped_milestones_milestone_id_key
             unique,
     milestone_name text not null
         constraint moped_milestones_milestone_name_key
             unique,
     milestone_description text,
     milestone_order integer,
     milestone_average_length integer,
     required_milestone boolean,
     related_phase_id int
);

-- Create the moped_proj_milestones association table
CREATE TABLE moped_proj_milestones
(
    project_milestone_id serial not null
        constraint moped_project_milestone_id_pkey
            primary key
        constraint moped_project_milestone_id_key
            unique,
    project_id integer not null
        constraint moped_project_milestone_project_id_fkey
            references moped_project
            on update restrict on delete restrict,
    milestone_name text not null,
    milestone_description text,
    milestone_order integer,
    completion_percentage integer,
    milestone_status text,
    milestone_privacy boolean,
    milestone_start date,
    milestone_end date,
    milestone_priority integer,
    milestone_date_type text,
    milestone_related_phase_id int,
    is_current_milestone boolean,
    completed boolean,
    started_by_user_id integer,
    completed_by_user_id integer,
    date_added timestamp with time zone default clock_timestamp()
);


comment on table moped_milestones is 'Standardized list of project milestones';

INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (0, 999, 'Unknown', 0);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (1, 1, 'Environmentally cleared', 10);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (2, 2, 'Initial field visit complete', 7);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (3, 3, '100% design', 7);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (4, 4, '90% design', 2);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (5, 5, '60% design', 1);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (6, 6, '30% design', 9);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (7, 7, 'Preliminary schematic complete', 9);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (8, 8, 'Study complete', 6);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (9, 9, 'Work order submitted', 2);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (10,10, 'Resurfacing not required', 11);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (11,11, 'Resurfacing scheduled', 1);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (12,12, 'Resurfacing deferred', 1);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (13,13, 'Resurfacing requested', 1);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (14,14, 'Need to request resurfacing', 1);
INSERT INTO public.moped_milestones (milestone_id, milestone_order, milestone_name, related_phase_id) VALUES (15,15, 'Already resurfaced', 1);
