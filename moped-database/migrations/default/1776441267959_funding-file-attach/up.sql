-- Create join table to link Moped projects, moped project funding rows, and Moped project files
CREATE TABLE public.files_project_funding (
    id SERIAL PRIMARY KEY,
    project_id int4 NOT NULL REFERENCES public.moped_project(project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    file_id int4 NOT NULL REFERENCES public.moped_project_files(project_file_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_user_id int4 NOT NULL REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id int4 NOT NULL REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE public.files_project_funding IS 'Join table to link Moped projects, Moped funding rows, and Moped project files to create funding file attachments.';
COMMENT ON COLUMN public.files_project_funding.project_id IS 'References the Moped project to which the file attachment belongs.';
COMMENT ON COLUMN public.files_project_funding.file_id IS 'References the file that is attached to the moped funding row.';
COMMENT ON COLUMN public.files_project_funding.created_at IS 'Timestamp for when the record was created.';
COMMENT ON COLUMN public.files_project_funding.updated_at IS 'Timestamp for when the record was last updated.';
COMMENT ON COLUMN public.files_project_funding.created_by_user_id IS 'References the user who created the file attachment record.';
COMMENT ON COLUMN public.files_project_funding.updated_by_user_id IS 'References the user who last updated the file attachment record.';
