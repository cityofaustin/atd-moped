/*
    First begin by wiping out existing values, we can afford to do this
    since we don't have real data yet.
*/
update moped_project set "eCapris_id" = null where true;

-- Let's now rename the table
alter table moped_project rename column "eCapris_id" to ecapris_subproject_id;

-- Change the type
alter table moped_project alter column ecapris_subproject_id type numeric using ecapris_subproject_id::numeric;

-- Set default to null
alter table moped_project alter column ecapris_subproject_id set default NULL;

-- We will not create the unique index
create unique index moped_project_ecapris_subproject_id_uindex
    on moped_project (ecapris_subproject_id);

-- Now it's turn for moped_proj_financials
alter table moped_proj_financials rename column "eCapris_id" to ecapris_subproject_id;
alter table moped_proj_financials alter column ecapris_subproject_id type numeric using ecapris_subproject_id::numeric;
