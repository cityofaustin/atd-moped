DROP VIEW current_phase_view;

CREATE VIEW public.current_phase_view AS (
    SELECT DISTINCT ON (project_id, is_current_phase)
        project_id,
        project_phase_id,
        phase_id
    FROM
        moped_proj_phases
    WHERE
        is_deleted = FALSE
        AND is_current_phase = TRUE
        -- order by ensures consistent DISTINCT ON results in edge case that a project has multiple curr phases
    ORDER BY
        project_id,
        is_current_phase,
        project_phase_id
);
