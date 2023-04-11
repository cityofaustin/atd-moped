CREATE TABLE moped_work_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE moped_work_types IS 'Lookup table for component work types';

CREATE TABLE moped_proj_component_work_types (
    id SERIAL PRIMARY KEY,
    project_component_id INTEGER NOT NULL REFERENCES moped_proj_components(project_component_id) ON UPDATE CASCADE ON DELETE CASCADE,
    work_type_id INTEGER NOT NULL REFERENCES moped_work_types(id) ON UPDATE CASCADE ON DELETE CASCADE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE moped_proj_component_work_types IS 'Tracks many work types per each project component';

CREATE TABLE moped_component_work_types (
    id SERIAL PRIMARY KEY,
    work_type_id INTEGER NOT NULL REFERENCES moped_work_types(id) ON UPDATE CASCADE ON DELETE CASCADE,
    component_id INTEGER NOT NULL REFERENCES moped_components(component_id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE moped_component_work_types ADD CONSTRAINT unique_work_type_component UNIQUE (work_type_id, component_id);

COMMENT ON TABLE moped_component_work_types IS 'Tracks allowed moped_work_types by component type';

INSERT INTO moped_work_types (name, key) VALUES 
    ('Construction Inspection', 'construction_inspection'),
    ('Construction / Curb modification / Widening', 'construction_curb_modification_widening'),
    ('Design Review', 'design_review'),
    ('Lane Conversion', 'lane_conversion'),
    ('Maintenance/Repair', 'maintenance_repair'),
    ('Modification', 'modification'),
    ('New', 'new'),
    ('Parking Mod', 'parking_mod'),
    ('Reinstall', 'reinstall'),
    ('Remove Bike Lane', 'remove_bike_lane'),
    ('Remove Double Yellow', 'remove_double_yellow'),
    ('Replacement', 'replacement'),
    ('Signal Take Over', 'signal_take_over');
