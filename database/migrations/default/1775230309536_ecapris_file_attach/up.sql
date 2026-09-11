-- Create join table to link Moped projects, eCAPRIS subproject funding rows, and Moped project files
CREATE TABLE public.files_ecapris_funding (
    id SERIAL PRIMARY KEY,
    project_id int4 NOT NULL REFERENCES public.moped_project(project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    entity_id int4 NOT NULL REFERENCES public.ecapris_subproject_funding(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    file_id int4 NOT NULL REFERENCES public.moped_project_files(project_file_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_user_id int4 NOT NULL REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id int4 NOT NULL REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT files_ecapris_funding_project_id_entity_id_file_id_key UNIQUE (project_id, entity_id, file_id)
);

COMMENT ON TABLE public.files_ecapris_funding IS 'Join table to link Moped projects, eCAPRIS subproject funding rows, and Moped project files to create eCAPRIS funding file attachments.';
COMMENT ON COLUMN public.files_ecapris_funding.project_id IS 'References the Moped project to which the file attachment belongs.';
COMMENT ON COLUMN public.files_ecapris_funding.entity_id IS 'References the ecapris_subproject_funding primary key to which the file attachment belongs.';
COMMENT ON COLUMN public.files_ecapris_funding.file_id IS 'References the file that is attached to the eCAPRIS funding row.';
COMMENT ON COLUMN public.files_ecapris_funding.created_at IS 'Timestamp for when the record was created.';
COMMENT ON COLUMN public.files_ecapris_funding.updated_at IS 'Timestamp for when the record was last updated.';
COMMENT ON COLUMN public.files_ecapris_funding.created_by_user_id IS 'References the user who created the file attachment record.';
COMMENT ON COLUMN public.files_ecapris_funding.updated_by_user_id IS 'References the user who last updated the file attachment record.';
