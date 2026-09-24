ALTER TABLE "public"."moped_proj_phases" ADD COLUMN "phase_name" text NOT NULL DEFAULT 'Unknown';

-- get phase_name based on phase_id
update moped_proj_phases mpp
set phase_name = mp.phase_name
from moped_phases mp
where mpp.phase_id = mp.phase_id;
