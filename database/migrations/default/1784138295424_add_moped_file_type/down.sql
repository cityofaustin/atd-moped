-- Rollback (delete from moped_file_types where slug = 'work_order_link')
-- is not possible since work order links were migrated from the work activity table to
-- moped project files. Since records with this file type exist, we cannot delete.
SELECT 0;
