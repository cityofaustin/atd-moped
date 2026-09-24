-- temporarily disable event triggers
SET session_replication_role = replica;

UPDATE
    moped_proj_components
SET
    description = NULL
WHERE
    description = '';

UPDATE
    moped_proj_components
SET
    location_description = NULL
WHERE
    location_description = '';

UPDATE
    moped_proj_components
SET
    srts_id = NULL
WHERE
    srts_id = '';

-- renable event triggers
SET session_replication_role = DEFAULT;
