ALTER TABLE public.moped_project_roles
    DROP COLUMN project_role_description;

-- Add a column
INSERT INTO public.moped_project_roles (
        project_role_id,
        project_role_name,
        active_role,
        role_order
    ) VALUES
        (1, true, 'Project Manager', 1),
        (2, true, 'Project owner', 2),
        (5, true, 'Project Coordinator', 4),
        (4, true, 'Design Review', 3),
        (6, true, 'Design Support', 6),
        (7, true, 'Design Consultant', 7),
        (8, true, 'Public Process Support', 8),
        (9, true, 'Implementation Support', 9),
        (10, true, 'Field Engineer', 10),
        (11, true, 'Project Sponsor', 11),
        (12, true, 'Unknown Role', 100)

    ON CONFLICT ON CONSTRAINT moped_project_roles_pkey
        DO UPDATE
            SET project_role_name = EXCLUDED.project_role_name,
                role_order = EXCLUDED.role_order
    ;

-- Delete any other roles
DELETE FROM public.moped_project_roles
    WHERE project_role_id > 12 OR project_role_id = 0;

