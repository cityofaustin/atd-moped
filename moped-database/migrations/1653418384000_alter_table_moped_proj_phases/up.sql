-- set phase_id based on phase_name
update moped_proj_phases mpp
set phase_id = phases.phase_id
from moped_phases phases
where mpp.phase_name = LOWER(phases.phase_name);

