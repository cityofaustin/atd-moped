-- We will soft delete added workgroups and component in the future if needed.

-- Revert all ATPWs to TPWs in entity names
UPDATE moped_entity
SET
    entity_name = replace(entity_name, 'ATPW', 'TPW');
