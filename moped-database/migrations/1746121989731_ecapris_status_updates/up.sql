-- Update moped_project table with should_sync_ecapris_statuses column and comment
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_statuses BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment for the new column
COMMENT ON COLUMN moped_project.should_sync_ecapris_statuses IS 'Indicates if project statuses should be synced with eCapris';


-- Create ecapris_status_updates table with column comments
CREATE TABLE public.ecapris_subproject_statuses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES moped_project (project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    subproject_id TEXT NOT NULL,
    subproject_name TEXT NOT NULL,
    subproject_status_id INTEGER NOT NULL,
    current_status_fl BOOLEAN NOT NULL,
    sub_project_status_desc TEXT NOT NULL,
    review_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    subproject_status_impacts TEXT,
    summary_description TEXT,
    reviewed_by_name TEXT NOT NULL,
    review_by_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by_user_id INTEGER REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id INTEGER REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

COMMENT ON TABLE public.ecapris_subproject_statuses IS 'Stores eCAPRIS subproject status records synced from the FSD Data Warehouse to supplement the moped_proj_notes table records.';
COMMENT ON COLUMN public.ecapris_subproject_statuses.id IS 'Primary key for the table';
COMMENT ON COLUMN public.ecapris_subproject_statuses.project_id IS 'Moped project ID';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_id IS 'eCapris subproject ID number';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_name IS 'Name of eCapris subproject';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_status_id IS 'Unique ID of subproject status';
COMMENT ON COLUMN public.ecapris_subproject_statuses.current_status_fl IS 'Is this the current and most recent status?';
COMMENT ON COLUMN public.ecapris_subproject_statuses.sub_project_status_desc IS 'Content of the subproject status';
COMMENT ON COLUMN public.ecapris_subproject_statuses.review_timestamp IS 'Timestamp of the status update - MM/DD/YYYY HH:MM:SS format';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_status_impacts IS 'Updates on project blockers';
COMMENT ON COLUMN public.ecapris_subproject_statuses.summary_description IS 'More of a public-ready status could be used down the road';
COMMENT ON COLUMN public.ecapris_subproject_statuses.reviewed_by_name IS 'First and last name of author';
COMMENT ON COLUMN public.ecapris_subproject_statuses.review_by_email IS 'Email of author';
COMMENT ON COLUMN public.ecapris_subproject_statuses.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.ecapris_subproject_statuses.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN public.ecapris_subproject_statuses.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN public.ecapris_subproject_statuses.updated_by_user_id IS 'ID of the user who updated the record';
COMMENT ON COLUMN public.ecapris_subproject_statuses.is_deleted IS 'Indicates soft deletion';

-- Add foreign key constraint to created_by_user_id column
-- Add foreign key constraint to project_id column


-- Create trigger to set updated_at audit column before update
CREATE TRIGGER set_ecapris_subproject_statuses_updated_at BEFORE UPDATE ON public.ecapris_subproject_statuses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create function to search for eCapris subproject status author match by email
-- Function to match user email and set created_by_user_id
CREATE OR REPLACE FUNCTION public.find_user_match_by_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to find matching user by email (case-insensitive)email 
    NEW.created_by_user_id := (
        SELECT user_id 
        FROM moped_users 
        WHERE LOWER(email) = LOWER(NEW.review_by_email)
        LIMIT 1
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call function to try match author (if there is one) before insert
CREATE TRIGGER find_ecapris_user_match_by_email BEFORE INSERT ON public.ecapris_subproject_statuses
FOR EACH ROW EXECUTE FUNCTION public.find_user_match_by_email();

-- Add unique constraint for non-deleted rows with same project_id and subproject_status_id
ALTER TABLE public.ecapris_subproject_statuses
ADD CONSTRAINT unique_project_subproject_status_ids
UNIQUE (project_id, subproject_status_id);
