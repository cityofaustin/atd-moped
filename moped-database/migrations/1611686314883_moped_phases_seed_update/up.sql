-- First remove foreign key relationships from moped_proj_phases for the phases 
-- we will delete.
DELETE FROM moped_proj_phases WHERE phase_name IN ('hold', 'canceled', 'preliminary design');
-- Then delete unneeded phases by id.
DELETE FROM moped_phases WHERE phase_id IN (9, 8, 4);
-- Add new phase.
INSERT INTO moped_phases (phase_id, phase_name) VALUES (10, 'procurement');
