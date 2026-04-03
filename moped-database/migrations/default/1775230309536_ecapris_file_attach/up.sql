-- Create join table to link Moped projects, eCAPRIS subproject funding rows, and Moped project files
CREATE TABLE public.ecapris_funding_files (
    id SERIAL PRIMARY KEY,
    project_id int4 NOT NULL REFERENCES public.moped_project(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
    entity_id int4 NOT NULL REFERENCES public.ecapris_subproject_funding(id) ON DELETE CASCADE ON UPDATE CASCADE,
    file_id int4 NOT NULL REFERENCES public.moped_project_files(project_file_id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ecapris_funding_files_project_id_entity_id_file_id_key UNIQUE (project_id, entity_id, file_id)
);
