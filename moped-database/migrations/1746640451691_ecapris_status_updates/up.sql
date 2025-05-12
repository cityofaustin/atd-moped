-- Update moped_project table with should_sync_ecapris_statuses column and comment
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_statuses BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment for the new column
COMMENT ON COLUMN moped_project.should_sync_ecapris_statuses IS 'Indicates if project statuses should be synced with eCapris';


-- Create ecapris_status_updates table with column comments
CREATE TABLE public.ecapris_subproject_statuses (
    id SERIAL PRIMARY KEY,
    subproject_id TEXT NOT NULL,
    subproject_name TEXT NOT NULL,
    subproject_status_id INTEGER NOT NULL UNIQUE,
    current_status_fl BOOLEAN NOT NULL,
    sub_project_status_desc TEXT,
    review_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    subproject_status_impacts TEXT,
    summary_description TEXT,
    reviewed_by_name TEXT NOT NULL,
    review_by_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by_user_id INTEGER REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id INTEGER REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE public.ecapris_subproject_statuses IS 'Stores eCAPRIS subproject status records synced from the FSD Data Warehouse to supplement the moped_proj_notes table records.';
COMMENT ON COLUMN public.ecapris_subproject_statuses.id IS 'Primary key for the table';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_id IS 'eCapris subproject ID number';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_name IS 'Name of eCapris subproject';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_status_id IS 'Unique ID of subproject status from eCapris';
COMMENT ON COLUMN public.ecapris_subproject_statuses.current_status_fl IS 'Is this the current and most recent status?';
COMMENT ON COLUMN public.ecapris_subproject_statuses.sub_project_status_desc IS 'Content of the subproject status';
COMMENT ON COLUMN public.ecapris_subproject_statuses.review_timestamp IS 'Timestamp of the status update - MM/DD/YYYY HH:MM:SS format';
COMMENT ON COLUMN public.ecapris_subproject_statuses.subproject_status_impacts IS 'Updates on project blockers';
COMMENT ON COLUMN public.ecapris_subproject_statuses.summary_description IS 'More of a public-ready status could be used down the road; nullable in eCapris';
COMMENT ON COLUMN public.ecapris_subproject_statuses.reviewed_by_name IS 'First and last name of author; nullable in eCapris';
COMMENT ON COLUMN public.ecapris_subproject_statuses.review_by_email IS 'Email of author';
COMMENT ON COLUMN public.ecapris_subproject_statuses.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.ecapris_subproject_statuses.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN public.ecapris_subproject_statuses.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN public.ecapris_subproject_statuses.updated_by_user_id IS 'ID of the user who updated the record';

-- Create trigger to set updated_at audit column before update
CREATE TRIGGER set_ecapris_subproject_statuses_updated_at BEFORE UPDATE ON public.ecapris_subproject_statuses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_ecapris_subproject_statuses_updated_at ON public.ecapris_subproject_statuses IS 'Trigger to set updated_at on row update';

-- Create function to search for eCapris subproject status author match by email and set created_by_user_id if found
CREATE OR REPLACE FUNCTION public.find_ecapris_user_match_by_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to find matching user by email (case-insensitive) email 
    NEW.created_by_user_id := (
        SELECT user_id 
        FROM moped_users 
        WHERE LOWER(email) = LOWER(NEW.review_by_email)
        LIMIT 1
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.find_ecapris_user_match_by_email() IS 'Function to attempt matching eCapris status author email to Moped users by email';

-- Create trigger to call function to try match author (if there is one) before insert
CREATE TRIGGER find_ecapris_user_match_by_email BEFORE INSERT ON public.ecapris_subproject_statuses
FOR EACH ROW EXECUTE FUNCTION public.find_ecapris_user_match_by_email();

COMMENT ON TRIGGER find_ecapris_user_match_by_email ON public.ecapris_subproject_statuses IS 'Trigger to attempt match of eCapris author to Moped user by email on insert';
