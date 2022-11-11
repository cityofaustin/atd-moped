UPDATE moped_project SET status_id = 1 WHERE status_id IS NULL;
UPDATE moped_project SET status_id = 1 WHERE status_id = 0;
ALTER TABLE moped_project ALTER COLUMN status_id SET NOT NULL;
ALTER TABLE moped_project ALTER COLUMN status_id SET DEFAULT 1;
DELETE FROM moped_status where status_id = 0;
