-- create and fill moped_work_types
CREATE TABLE moped_work_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE moped_work_types IS 'Lookup table for component work types';

INSERT INTO moped_work_types (name, key) VALUES 
    ('Construction Inspection', 'construction_inspection'),
    ('Construction / Curb modification / Widening', 'construction_curb_modification_widening'),
    ('Design Review', 'design_review'),
    ('Lane Conversion', 'lane_conversion'),
    ('Maintenance / Repair', 'maintenance_repair'),
    ('Modification', 'modification'),
    ('New', 'new'),
    ('Parking Mod', 'parking_mod'),
    ('Reinstall', 'reinstall'),
    ('Remove Bike Lane', 'remove_bike_lane'),
    ('Remove Double Yellow', 'remove_double_yellow'),
    ('Replacement', 'replacement'),
    ('Signal Take Over', 'signal_take_over');


-- create and fill moped_component_work_types
CREATE TABLE moped_component_work_types (
    id SERIAL PRIMARY KEY,
    work_type_id INTEGER NOT NULL REFERENCES moped_work_types(id) ON UPDATE CASCADE ON DELETE CASCADE,
    component_id INTEGER NOT NULL REFERENCES moped_components(component_id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE moped_component_work_types ADD CONSTRAINT unique_work_type_component UNIQUE (work_type_id, component_id);

COMMENT ON TABLE moped_component_work_types IS 'Tracks allowed moped_work_types by component type';

-- for now, set new, mod, and maintenance as the default allowed types for all components
WITH inserts_todo AS (
    SELECT
        id AS work_type_id,
        component_id
    FROM (
        values('new'),
            ('modification'),
            ('maintenance_repair')) AS data (work_type_key)
        LEFT JOIN moped_components ON TRUE
        LEFT JOIN moped_work_types mwt ON data.work_type_key = mwt.key
    WHERE
        moped_components.is_deleted = FALSE
) INSERT INTO moped_component_work_types (work_type_id, component_id)
SELECT
    *
FROM
    inserts_todo;

-- create moped_proj_component_work_types to hold project data
CREATE TABLE moped_proj_component_work_types (
    id SERIAL PRIMARY KEY,
    project_component_id INTEGER NOT NULL REFERENCES moped_proj_components(project_component_id) ON UPDATE CASCADE ON DELETE CASCADE,
    work_type_id INTEGER NOT NULL REFERENCES moped_work_types(id) ON UPDATE CASCADE ON DELETE CASCADE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE moped_proj_component_work_types IS 'Tracks many work types per each project component';
