CREATE TABLE public.moped_status (
    status_name text NOT NULL,
    status_id integer NOT NULL,
    status_description text,
    status_order integer NOT NULL
);

INSERT INTO public.moped_status (status_id, status_name, status_description, status_order) VALUES
    (0, 'Unknown', 'Unknown State', 999),
    (1, 'Active', 'Project is currently being tracked in some capacity irrespective of phase', 1),
    (2, 'Potential', 'Project needs to be funded or prioritized in order to become active; otherwise, it will remain as a potential need', 2),
    (3, 'Canceled', 'Project is canceled and will no longer proceed through all phases', 3),
    (4, 'On hold', 'Project is suspended at the moment', 4),
    (5, 'Complete', 'Project is implemented fully', 5);
