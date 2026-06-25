-- Create join table to link Moped projects, moped project funding rows, and Moped project files
CREATE TABLE public.files_project_work_activities (
    id SERIAL PRIMARY KEY,
    entity_id INT4 NOT NULL REFERENCES public.moped_proj_work_activity (
        id
    ) ON DELETE RESTRICT ON UPDATE CASCADE,
    file_id INT4 NOT NULL REFERENCES public.moped_project_files (
        project_file_id
    ) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_user_id INT4 NOT NULL REFERENCES moped_users (
        user_id
    ) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id INT4 NOT NULL REFERENCES moped_users (
        user_id
    ) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- Add unique constraint for upserts
ALTER TABLE public.files_project_work_activities
ADD CONSTRAINT files_project_work_activities_entity_id_file_id_key
UNIQUE (entity_id, file_id);

-- Trigger to set updated_at
CREATE TRIGGER set_files_updated_at BEFORE UPDATE ON public.files_project_work_activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.files_project_work_activities IS 'Join table to link Moped work activity rows and Moped project files to create work activity file attachments.';
COMMENT ON COLUMN public.files_project_work_activities.entity_id IS 'References the Moped project work activity record to which the file attachment belongs.';
COMMENT ON COLUMN public.files_project_work_activities.file_id IS 'References the file that is attached to the work activity row.';
COMMENT ON COLUMN public.files_project_work_activities.created_at IS 'Timestamp for when the record was created.';
COMMENT ON COLUMN public.files_project_work_activities.updated_at IS 'Timestamp for when the record was last updated.';
COMMENT ON COLUMN public.files_project_work_activities.created_by_user_id IS 'References the user who created the file attachment record.';
COMMENT ON COLUMN public.files_project_work_activities.updated_by_user_id IS 'References the user who last updated the file attachment record.';
COMMENT ON COLUMN public.files_project_work_activities.is_deleted IS 'Indicates soft deletion';
