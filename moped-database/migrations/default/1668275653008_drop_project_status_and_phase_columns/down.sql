ALTER TABLE moped_project
    ADD COLUMN current_phase text;

ALTER TABLE moped_project
    ADD COLUMN current_status text;

ALTER TABLE moped_project
    ADD COLUMN current_phase_id integer;

ALTER TABLE moped_project
    ADD COLUMN status_id integer;
