-- Rename the phase column back from order to rank
ALTER TABLE moped_phases
    RENAME COLUMN "phase_order" TO "phase_rank";

ALTER TABLE moped_proj_phases
    RENAME COLUMN "phase_order" TO "phase_rank";

-- Drop the current primary key for
alter table moped_proj_phases
    drop constraint moped_proj_phases_pkey;

-- Restore the old key constraint
alter table moped_proj_phases
    add constraint moped_phase_history_pkey
        primary key ( project_phase_id );

-- Drop the phase_id foreign key
alter table moped_proj_phases
    drop constraint moped_proj_phases_moped_phases_phase_id_fk;

-- Delete Unknown Phase
delete from moped_phases where phase_name = 'unknown';

-- Drop the phase_id column
alter table moped_proj_phases
    drop column phase_id,
    drop column status_id;

-- Re-create the primary key constraint
alter table moped_proj_phases
    add constraint moped_proj_phases_project_phase_id_key
        unique (project_phase_id);

-- Re-create foreign key
alter table moped_proj_phases
    add foreign key (phase_name)
        references moped_phases(phase_name)
            on update restrict on delete restrict;
