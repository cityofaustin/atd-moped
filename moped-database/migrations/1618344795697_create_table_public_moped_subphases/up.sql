ALTER TABLE moped_project ADD COLUMN subphase_id integer NULL;

CREATE INDEX moped_project_subphase_id_index
    on moped_project (subphase_id);

-- Create moped_subphases table
CREATE TABLE moped_subphases(
    subphase_id serial not null
        constraint moped_subphases_subphase_id_pkey
            primary key
        constraint moped_subphases_subphase_id_key
            unique,
    subphase_name text not null
        constraint moped_subphases_subphase_name_key
        unique,
    subphase_description text,
    subphase_rank integer,
    subphase_average_length integer,
    required_subphase boolean
);

-- Create the moped_proj_subphases association table
CREATE TABLE moped_proj_subphases
(
    project_subphase_id serial not null
        constraint moped_project_subphase_id_pkey
            primary key
        constraint moped_project_subphase_id_key
            unique,
    project_id integer not null
        constraint moped_project_subphase_project_id_fkey
            references moped_project
            on update restrict on delete restrict,
    subphase_name text not null,
    subphase_description text,
    subphase_rank integer,
    completion_percentage integer,
    subphase_status text,
    subphase_privacy boolean,
    subphase_start date,
    subphase_end date,
    subphase_priority integer,
    subphase_date_type text,
    is_current_subphase boolean,
    completed boolean,
    started_by_user_id integer,
    completed_by_user_id integer,
    date_added timestamp with time zone default clock_timestamp()
);


comment on table moped_subphases is 'Standardized list of project sub-phases';
