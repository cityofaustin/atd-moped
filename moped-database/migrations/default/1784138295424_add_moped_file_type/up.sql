INSERT INTO moped_file_types (id, name, slug) VALUES
(5, 'Work order link', 'work_order_link');

-- Update comment on work_order_url in moped_proj_work_activity to indicate it is deprecated
COMMENT ON COLUMN moped_proj_work_activity.work_order_url IS '(Deprecated) External link to a related work order. E.g., to the Knack Data Tracker';
