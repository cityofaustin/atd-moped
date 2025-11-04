-- Add CSD and SMS workgroups
INSERT INTO
public.moped_workgroup (workgroup_name, department_id, workgroup_abbreviation)
VALUES
('Community Services Division', 11, 'CSD');

INSERT INTO
public.moped_workgroup (workgroup_name, department_id, workgroup_abbreviation)
VALUES
('Shared Mobility Services', 11, 'SMS');

-- Update all TPWs to ATPWs in entity names
UPDATE moped_entity
SET
    entity_name = replace(entity_name, 'TPW', 'ATPW');
