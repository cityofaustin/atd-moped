-- In order to delete work_order_link type, change all existing work order link types to "other"
update moped_project_files set file_type = 4 where file_type = 5;

delete from moped_file_types where slug = 'work_order_link';
