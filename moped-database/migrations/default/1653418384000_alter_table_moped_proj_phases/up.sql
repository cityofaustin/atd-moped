-- set phase_id based on phase_name
update moped_proj_phases mpp
set phase_id = phases.phase_id
from moped_phases phases
where mpp.phase_name = LOWER(phases.phase_name);

-- set subphase_id based on subphase_name
update moped_proj_phases mpp
set subphase_id = subphases.subphase_id
from moped_subphases subphases
where mpp.subphase_name = LOWER(subphases.subphase_name);


ALTER TABLE moped_project ADD COLUMN current_phase_id integer;

-- set current_phase_id based on phase_name
update moped_project mp
set current_phase_id = phases.phase_id
from moped_phases phases
where mp.current_phase = LOWER(phases.phase_name);

-- Remove null constraint
ALTER TABLE moped_proj_phases ALTER COLUMN phase_name DROP NOT NULL;

COMMENT ON COLUMN moped_proj_phases.phase_name IS 'Deprecated phase name column';


