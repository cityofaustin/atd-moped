ALTER TABLE moped_proj_work_activity RENAME COLUMN interim_work_activity_id to interim_work_order_id_old;
ALTER TABLE moped_proj_work_activity DROP COLUMN work_order_url, DROP COLUMN reference_id;
