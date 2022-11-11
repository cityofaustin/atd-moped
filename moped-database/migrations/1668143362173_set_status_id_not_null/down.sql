-- cannot rollback these two migrations
-- UPDATE moped_project SET status_id = 1 WHERE status_id IS NULL;
-- UPDATE moped_project SET status_id = 1 WHERE status_id = 0;
ALTER TABLE moped_project ALTER COLUMN status_id DROP NOT NULL;
ALTER TABLE moped_project ALTER COLUMN status_id DROP DEFAULT;
INSERT INTO moped_status (status_name, status_flag, status_priority, status_id, status_description, status_order) 
    VALUES ('Unknown', NULL, NULL, 0, 'Unknown State', 999);
