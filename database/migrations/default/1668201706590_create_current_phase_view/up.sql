CREATE VIEW public.current_phase_view AS (
    SELECT DISTINCT ON (project_id, is_current_phase)
        mpp.project_id,
        mpp.project_phase_id,
        mpp.phase_id,
        mp.phase_name,
        mp.phase_key
    FROM
        moped_proj_phases mpp
    LEFT JOIN moped_phases mp ON mp.phase_id = mpp.phase_id
WHERE
    is_deleted = FALSE
    AND is_current_phase = TRUE
    -- order by ensures consistent DISTINCT ON results in edge case that a project has multiple curr phases
ORDER BY
    project_id,
    is_current_phase,
    project_phase_id
);
