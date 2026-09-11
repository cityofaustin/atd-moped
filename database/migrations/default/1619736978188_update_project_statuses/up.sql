/*
  Migration to update the moped status table
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
    -- Drop the status key constraint
    alter table moped_proj_status_history
        drop constraint moped_proj_status_history_project_status_fkey;


    -- Add the status_id column to the project & index it
    alter table moped_project add status_id int;
    create index moped_project_status_id_index on moped_project (status_id);

    -- Now drop the unique name constraint and name index
    alter table moped_status drop constraint moped_status_status_name_key;
--     drop index moped_status_status_name_key;

    -- Add two more columns for description and order
    ALTER TABLE public.moped_status
        ADD COLUMN status_description text null,
        ADD COLUMN status_order int not null default 0;

    -- Upsert the project roles
    INSERT INTO public.moped_status (
        status_id,
        status_name,
        status_description,
        status_order
    ) VALUES
        (0, 'Unknown', 'Unknown State', 999),
        (1, 'Active', 'Project is currently being tracked in some capacity irrespective of phase', 1),
        (2, 'Potential', 'Project needs to be funded or prioritized in order to become active; otherwise, it will remain as a potential need', 2),
        (3, 'Canceled', 'Project is canceled and will no longer proceed through all phases', 3),
        (4, 'On hold', 'Project is suspended at the moment', 4),
        (5, 'Complete', 'Project is implemented fully', 5),
        (6, 'Archived', 'Project is deleted', 6)

    ON CONFLICT ON CONSTRAINT moped_status_pkey
        DO UPDATE
        SET status_name = EXCLUDED.status_name,
            status_description = EXCLUDED.status_description,
            status_order = EXCLUDED.status_order
    ;

END $$;


