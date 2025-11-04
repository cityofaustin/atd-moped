-- We will soft delete added workgroups in the future if needed.

-- Revert all ATPWs to TPWs in entity names
UPDATE moped_entity
SET
    entity_name = replace(entity_name, 'ATPW', 'TPW');
