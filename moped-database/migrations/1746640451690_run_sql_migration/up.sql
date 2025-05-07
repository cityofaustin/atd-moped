-- Ensures that projects can only have one current phase
REATE UNIQUE INDEX moped_proj_phases_partial_constraint ON moped_proj_phases (project_id)
    WHERE (is_current_phase = TRUE AND is_deleted = FALSE);
