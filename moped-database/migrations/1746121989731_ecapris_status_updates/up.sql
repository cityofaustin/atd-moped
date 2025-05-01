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
    subproject_status_impacts TEXT NOT NULL,
    summary_description TEXT NOT NULL,
    reviewed_by_name TEXT NOT NULL,
    review_by_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by_user_id INTEGER,
    updated_by_user_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

COMMENT ON TABLE ecapris.subproject_statuses IS 'Stores eCAPRIS subproject status information';
COMMENT ON COLUMN ecapris.subproject_statuses.id IS 'Primary key for the table';
COMMENT ON COLUMN ecapris.subproject_statuses.project_id IS 'Moped project ID';
COMMENT ON COLUMN ecapris.subproject_statuses.subproject_id IS 'eCapris subproject ID number';
COMMENT ON COLUMN ecapris.subproject_statuses.subproject_name IS 'Name of eCapris subproject';
COMMENT ON COLUMN ecapris.subproject_statuses.subproject_status_id IS 'Unique ID of subproject status';
COMMENT ON COLUMN ecapris.subproject_statuses.current_status_fl IS 'Is this the current and most recent status?';
COMMENT ON COLUMN ecapris.subproject_statuses.sub_project_status_desc IS 'Content of the subproject status';
COMMENT ON COLUMN ecapris.subproject_statuses.review_timestamp IS 'Timestamp of the status update - MM/DD/YYYY HH:MM:SS format';
COMMENT ON COLUMN ecapris.subproject_statuses.subproject_status_impacts IS 'Updates on project blockers';
COMMENT ON COLUMN ecapris.subproject_statuses.summary_description IS 'More of a public-ready status could be used down the road';
COMMENT ON COLUMN ecapris.subproject_statuses.reviewed_by_name IS 'First and last name of author';
COMMENT ON COLUMN ecapris.subproject_statuses.review_by_email IS 'Email of author';
COMMENT ON COLUMN ecapris.subproject_statuses.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN ecapris.subproject_statuses.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN ecapris.subproject_statuses.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN ecapris.subproject_statuses.updated_by_user_id IS 'ID of the user who updated the record';
COMMENT ON COLUMN ecapris.subproject_statuses.is_deleted IS 'Indicates soft deletion';
