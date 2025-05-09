ALTER TABLE moped_proj_work_activity RENAME COLUMN interim_work_order_id_old TO interim_work_activity_id;

ALTER TABLE moped_proj_work_activity
    ADD COLUMN work_order_url text,
    ADD COLUMN reference_id text 
        GENERATED ALWAYS AS (COALESCE(interim_work_activity_id, 'MPD-' || project_id::text || '-' || id::text)) STORED;

COMMENT ON COLUMN moped_proj_work_activity.work_order_url IS 'External link to a related work order. E.g., to the Knack Data Tracker';
COMMENT ON COLUMN moped_proj_work_activity.reference_id IS 'An auto-generated ID that can be submitted to work order systems to indicate that the work originated from a Moped project.';
