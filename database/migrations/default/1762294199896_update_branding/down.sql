-- We will soft delete added workgroups and component in the future if needed.

-- Revert all ATPWs to TPWs in entity names
UPDATE moped_entity
SET
    entity_name = replace(entity_name, 'ATPW', 'TPW');

-- Update all TPWs to ATPWs in entity names
UPDATE moped_project_roles
SET
    project_role_description = replace(project_role_description, 'ATPW', 'TPW'),
    project_role_name = replace(project_role_name, 'ATPW', 'TPW');
