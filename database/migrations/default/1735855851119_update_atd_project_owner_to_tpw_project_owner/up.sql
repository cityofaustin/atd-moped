UPDATE moped_project_roles
SET project_role_name = 'TPW Project Owner'
WHERE project_role_id = 5;

UPDATE moped_project_roles
SET project_role_description = 'Supervises contractor activities for approval before invoicing; accepts work on behalf of TPW and coordinates with other divisions'
WHERE project_role_id = 12;

DELETE FROM moped_project_roles
WHERE project_role_id = 0;
