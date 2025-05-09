INSERT INTO moped_project_roles (project_role_id, project_role_name, active_role, role_order, project_role_description)
VALUES (0, 'Unknown', TRUE, 999, 'Unknown Role');

UPDATE moped_project_roles
SET project_role_description = 'Supervises contractor activities for approval before invoicing; accepts work on behalf of ATD and coordinates with other divisions'
WHERE project_role_id = 12;

UPDATE moped_project_roles
SET project_role_name = 'ATD Project Owner'
WHERE project_role_id = 5;
