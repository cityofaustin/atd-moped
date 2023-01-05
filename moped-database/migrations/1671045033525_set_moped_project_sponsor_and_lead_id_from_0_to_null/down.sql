-- replace moped_project project_sponsor and project_lead_id null with id of 0
update moped_project set project_sponsor = 0 where project_sponsor = null;
update moped_project set project_lead_id = 0 where project_lead_id = null;
