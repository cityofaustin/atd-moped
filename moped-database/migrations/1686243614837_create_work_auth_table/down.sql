UPDATE moped_activity_log SET record_type = 'moped_proj_contract'
    WHERE record_type = 'moped_proj_work_activity';

ALTER TABLE moped_proj_work_activity
    DROP CONSTRAINT status_id_fkey,
    DROP CONSTRAINT created_by_user_fkey,
    DROP CONSTRAINT updated_by_user_fkey,
    DROP COLUMN interim_work_order_id_old,
    DROP COLUMN implementation_workgroup_id,
    DROP COLUMN task_orders,
    DROP COLUMN status_id,
    DROP COLUMN status_note,
    DROP COLUMN created_by_user_id,
    DROP COLUMN created_at,
    DROP COLUMN updated_by_user_id,
    DROP COLUMN updated_at;

DROP TABLE moped_proj_work_activity_status;

ALTER TABLE moped_proj_work_activity RENAME TO moped_proj_contract;
