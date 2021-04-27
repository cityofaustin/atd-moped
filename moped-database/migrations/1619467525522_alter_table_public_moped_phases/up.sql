/*
  Migration to update moped phases locally and at the cloud.
 */
DO $$
DECLARE
    -- This variable allows us to know if we are in local, staging or production.
    currentDatabase text := (
        SELECT (
            CASE
                WHEN current_database() = 'moped' THEN 'local'
                WHEN current_database() = 'atd_moped_staging' THEN 'staging'
                WHEN current_database() = 'atd_moped' THEN 'production'
                ELSE 'unknown'
            END
        )
    );
BEGIN
    -- First drop the foreign key to phase_name
    alter table moped_proj_phases
        drop constraint moped_phase_history_phase_name_fkey;

    -- Drop the current primary key unique constraint
    alter table moped_proj_phases
        drop constraint moped_phase_history_project_milestone_id_key;

    -- Insert Unknown Phase
    INSERT INTO moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id)
        VALUES ('unknown', null, null, null, null, 0);

    -- Create a new column for phases
    alter table moped_proj_phases
        add phase_id int default 0 not null;

    -- Create Phase_ID foreign key
    alter table moped_proj_phases
        add constraint moped_proj_phases_moped_phases_phase_id_fk
            foreign key (phase_id) references moped_phases;

    -- Insert Unknown Phase
    INSERT INTO moped_phases (phase_id, phase_rank, phase_name, phase_description, phase_average_length, required_phase)
        VALUES
            (1, 1, 'Potential', 'Project has not been funded or prioritized; often part of needs assessment', null, null),
            (2, 2, 'Planned', 'Project is planned but has yet to move into additional phases', null, null),
            (3, 3, 'Preliminary engineering', 'Project feasibility and alternatives are being evaluated whether a scope has been detailed or not', null, null),
            (4, 4, 'Scoping', 'Project is prioritized but needs details on scope', null, null),
            (5, 5, 'Preliminary design', 'Project design is not yet underway but awaiting actions to move it to design', null, null),
            (6, 6, 'Design', 'Project is undergoing a traditional 30%, 60%, 90%, 100% design phase', null, null),
            (7, 7, 'Pre-construction', 'Project is dealing with permitting, procurement, or other processes needed between design and construction', null, null),
            (8, 8, 'Construction-ready', 'Project is ready for construction pending schedules, work orders, etc', null, null),
            (9, 9, 'Construction', 'Project is in construction', null, null),
            (10,10,'Post-construction', 'Project is fully complete but pending actions or items to close it out', null, null),
            (11,11,'Complete', 'Project is fully complete and fully closed out', null, null),
            (0, 999, 'Unknown', 'Unknown - Default', null, null)

        ON CONFLICT ON CONSTRAINT moped_phases_phase_id_key
        DO UPDATE
            SET phase_rank = EXCLUDED.phase_rank,
                phase_name = EXCLUDED.phase_name,
                phase_description = EXCLUDED.phase_description
        ;
END $$;


