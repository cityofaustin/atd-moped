-- Remove Transportation Demand Management (TDM) entity and workgroup added in the up migration.

DELETE FROM moped_entity
WHERE entity_name = 'COA ATPW Transportation Demand Management';

DELETE FROM moped_workgroup
WHERE
    workgroup_name = 'Transportation Demand Management'
    AND workgroup_abbreviation = 'TDM';
