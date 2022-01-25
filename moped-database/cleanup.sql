-- handle tables in https://github.com/cityofaustin/atd-data-tech/issues/6233#issuecomment-964247418
-- grouped by interconnected FKs
--
drop table moped_proj_fund_opp;
drop table moped_fund_opp;
--
drop table moped_proj_groups;
drop table moped_group;
--
alter table moped_proj_notes drop column comm_id;
drop table moped_proj_communication;
--
drop table moped_proj_dates;
--
drop table moped_proj_location;
--
drop table moped_proj_status_history;
--
drop table moped_proj_status_notes;
-- 
drop table moped_proj_timeline;