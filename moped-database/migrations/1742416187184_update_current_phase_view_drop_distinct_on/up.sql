-- Removes DISTINCT ON handling which was causing query timeouts
CREATE OR REPLACE VIEW current_phase_view AS SELECT
    mpp.project_id,
    mpp.project_phase_id,
    mpp.phase_id,
    mp.phase_name,
    mp.phase_key,
    mp.phase_name_simple
FROM moped_proj_phases mpp
LEFT JOIN moped_phases mp ON mp.phase_id = mpp.phase_id
WHERE mpp.is_deleted = false AND mpp.is_current_phase = true
ORDER BY mpp.project_id, mpp.is_current_phase, mpp.project_phase_id;
