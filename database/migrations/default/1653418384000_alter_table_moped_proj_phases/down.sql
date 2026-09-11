/* Note: records imported from data tracker via the knack migration script have phase_ids
 * and subphase associated with them. Records added after the migration script do not. 
 * We were not using the column previous to this migration on the front end.  
 */

ALTER TABLE moped_project DROP COLUMN current_phase_id;

-- Add back the null constraint
ALTER TABLE moped_proj_phases ALTER COLUMN phase_name SET NOT NULL;

COMMENT ON COLUMN moped_proj_phases.phase_name IS NULL;
