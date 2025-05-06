-- replace moped_project project_sponsor and project_lead_id of 0 with null
update moped_project set project_sponsor = null where project_sponsor = 0;
update moped_project set project_lead_id = null where project_lead_id = 0;
