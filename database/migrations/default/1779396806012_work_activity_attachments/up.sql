-- Create join table to link Moped projects, project work activity rows, Moped project file rows
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

-- Update moped_proj_components updated_by_user_id that are 29 (former Data and Tech Admin) to 1 (current Data and Tech Admin).
-- These came from a previous backfill of Safe Routes to School data on project components.
-- User 29 no longer exists/violates the desired foreign key constraint for the updated_by_user_id column in moped_proj_components.
-- See https://github.com/cityofaustin/atd-data-tech/issues/15039, https://github.com/cityofaustin/atd-data-tech/issues/14476
-- Disable Hasura triggers temporarily to allow direct updates to moped_proj_components without generating activity log entries
-- or updating audit fields with updates not relevant to users.
DO $$
BEGIN
    PERFORM manage_trigger('update_moped_proj_components_and_project_audit_fields', 'moped_proj_components', FALSE);
    PERFORM manage_trigger('notify_hasura_activity_log_moped_proj_components_UPDATE', 'moped_proj_components', FALSE);
END $$;

UPDATE moped_proj_components SET updated_by_user_id = 1 WHERE updated_by_user_id = 29;

DO $$
BEGIN
    PERFORM manage_trigger('update_moped_proj_components_and_project_audit_fields', 'moped_proj_components', TRUE);
    PERFORM manage_trigger('notify_hasura_activity_log_moped_proj_components_UPDATE', 'moped_proj_components', TRUE);
END $$;

-- Add foreign key constraints for created_by_user_id and updated_by_user_id
ALTER TABLE moped_proj_components ADD CONSTRAINT fk_created_by_user_id FOREIGN KEY (
    created_by_user_id
) REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE moped_proj_components ADD CONSTRAINT fk_updated_by_user_id FOREIGN KEY (
    updated_by_user_id
) REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE moped_proj_milestones ADD CONSTRAINT fk_created_by_user_id FOREIGN KEY (
    created_by_user_id
) REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE moped_proj_milestones ADD CONSTRAINT fk_updated_by_user_id FOREIGN KEY (
    updated_by_user_id
) REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE moped_proj_notes ADD CONSTRAINT fk_updated_by_user_id FOREIGN KEY (
    updated_by_user_id
) REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;

COMMENT ON COLUMN moped_proj_notes.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_components.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_components.updated_by_user_id IS 'ID of the user who last updated the record';
COMMENT ON COLUMN moped_proj_milestones.created_by_user_id IS 'ID of the user who created the record';
