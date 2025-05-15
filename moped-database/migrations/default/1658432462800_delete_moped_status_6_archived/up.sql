-- Deprecated row intended to show a deleted project
-- Soft deleted projects now use is_deleted column in the moped_project table
DELETE FROM moped_status WHERE status_id = 6;
