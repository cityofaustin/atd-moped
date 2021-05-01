-- We see them from our own frame of reference
drop index moped_project_status_id_index;
alter table moped_project drop column status_id;

-- Now alter the status
ALTER TABLE public.moped_status
    DROP COLUMN status_description,
    DROP COLUMN status_order;

create unique index moped_status_status_name_uindex
    on moped_status (status_name);

-- Add a column
INSERT INTO public.moped_status (
    status_name,
    status_flag,
    status_priority,
    status_id
) VALUES
    ('active', null, null, 1),
    ('potential', null, null, 2),
    ('complete', null, null, 3),
    ('canceled', null, null, 4),
    ('hold', null, null, 5)

ON CONFLICT ON CONSTRAINT moped_status_pkey
    DO UPDATE
    SET status_name = EXCLUDED.status_name,
        status_flag = EXCLUDED.status_flag,
        status_priority = EXCLUDED.status_priority
;

-- Delete any other roles
DELETE FROM public.moped_status
    WHERE status_id > 5 OR status_id = 0;


-- Restore the status history foreign key
alter table moped_proj_status_history
    add constraint moped_proj_status_history_moped_status_status_name_fk
        foreign key (status_name) references moped_status (status_name);

