-- First, drop the index
drop index moped_project_ecapris_subproject_id_uindex;

-- Change the type back to text
alter table moped_project alter column ecapris_subproject_id type text using ecapris_subproject_id::text;

-- Rename the table to what it used to be
alter table moped_project rename column "ecapris_subproject_id" to "eCapris_id";

-- Now it's turn for moped_proj_financials
alter table moped_proj_financials rename column "ecapris_subproject_id" to "eCapris_id";
alter table moped_proj_financials alter column "eCapris_id" type numeric using "eCapris_id"::numeric;
