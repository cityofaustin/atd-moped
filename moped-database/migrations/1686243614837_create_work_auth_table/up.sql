CREATE TABLE moped_proj_work_activity_status (
    id serial PRIMARY KEY,
    KEY text UNIQUE,
    name text,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE moped_proj_contract RENAME TO moped_proj_work_activity;

ALTER TABLE moped_proj_work_activity
    ADD COLUMN interim_work_order_id_old text,
    ADD COLUMN implementation_workgroup text,
    ADD COLUMN task_orders jsonb,
    ADD COLUMN status_id integer,
    ADD COLUMN status_note text,
    ADD COLUMN created_by_user_id integer,
    ADD COLUMN created_at timestamp WITH time zone NOT NULL DEFAULT now(),
    ADD COLUMN updated_by_user_id integer,
    ADD COLUMN updated_at timestamp WITH time zone NOT NULL DEFAULT now(),
    ADD CONSTRAINT status_id_fkey FOREIGN KEY (status_id)
        REFERENCES moped_proj_work_activity_status (id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    ADD CONSTRAINT created_by_user_fkey FOREIGN KEY (created_by_user_id)
        REFERENCES moped_users (user_id)
        ON UPDATE CASCADE ON DELETE SET NULL, 
    ADD CONSTRAINT updated_by_user_fkey FOREIGN KEY (updated_by_user_id)
        REFERENCES moped_users (user_id)
        ON UPDATE CASCADE ON DELETE SET NULL;

UPDATE moped_activity_log SET record_type = 'moped_proj_work_activity'
    WHERE record_type = 'moped_proj_contract';


-- backfill created_by, created_at, updated_at
-- this will need to be done during a live session bc
-- we should disable event triggers during these updates
-- UPDATE
--     moped_proj_work_activity
-- SET
--     created_at = work_activity_insert_event.created_at,
--     created_by_user_id = work_activity_insert_event.updated_by_user_id,
--     updated_by_user_id = work_activity_insert_event.updated_by_user_id
-- FROM (
--     SELECT
--         record_id,
--         created_at,
--         updated_by_user_id
--     FROM
--         moped_activity_log
--     WHERE
--         record_type = 'moped_proj_work_activity'
--         AND operation_type = 'INSERT') AS work_activity_insert_event
-- WHERE
--     moped_proj_work_activity.id = work_activity_insert_event.record_id;

-- -- backfill updated_at, updated_by if update events exist
-- UPDATE moped_proj_work_activity
-- SET
--     updated_at = work_activity_update_event.created_at,
--     updated_by_user_id = work_activity_update_event.updated_by_user_id
--     FROM (
-- SELECT DISTINCT ON (record_id)
--     record_id,
--     created_at,
--     updated_by_user_id
-- FROM
--     moped_activity_log
-- WHERE
--     operation_type = 'UPDATE' AND
--     record_type = 'moped_proj_work_activity'
-- ORDER BY
--     record_id,
--     created_at DESC)  AS work_activity_update_event
-- WHERE
--     moped_proj_work_activity.id = work_activity_update_event.record_id;
