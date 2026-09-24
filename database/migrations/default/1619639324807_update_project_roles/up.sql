-- Add another column
ALTER TABLE public.moped_project_roles
    ADD COLUMN project_role_description text null;

-- Upsert the project roles
INSERT INTO public.moped_project_roles (
        project_role_id,
        active_role,
        project_role_name,
        project_role_description,
        role_order
    ) VALUES
        (0, true, 'Unknown', 'Unknown Role', 999),
        (1, true, 'Program manager', 'Oversees a portfolio of projects, often under a named program', 1),
        (2, true, 'Project owner', 'Responsible for successful project implementation', 2),
        (5, true, 'ATD project owner', 'Responsible for successful project implementation when project is owned by an outside organization (CTRMA, TxDOT, etc.)', 4),
        (4, true, 'Project manager', 'Keeps project within specific scope, schedule, and budget', 3),
        (6, true, 'Financial analyst', 'Handles financial accounting related to projects, forecasting', 6),
        (7, true, 'Lead designer - PE', 'Licensed engineer responsible for leading or overseeing project design; may be the person sealing the plans', 7),
        (8, true, 'Designer', 'Produces project drawings', 8),
        (9, true, 'Design support', 'Provides design support including review and consultation', 9),
        (10, true, 'Public engagement', 'Leads project''s public engagement efforts', 10),
        (11, true, 'Field engineer', 'Licensed engineer supervising fieldwork', 11),
        (12, true, 'Inspector', 'Supervises contractor activities for approval before invoicing; accepts work on behalf of ATD and coordinates with other divisions', 12),
        (13, true, 'Implementation support', 'Supports project implementation', 13),
        (14, true, 'Project coordinator', 'Coordinates discrete tasks', 14),
        (15, true, 'Field assistant', 'Handles miscellaneous tasks in the field', 15),
        (16, true, 'Project support', 'Performs a role not described above', 16)

    ON CONFLICT ON CONSTRAINT moped_project_roles_pkey
        DO UPDATE
            SET active_role = EXCLUDED.active_role,
                project_role_name = EXCLUDED.project_role_name,
                project_role_description = EXCLUDED.project_role_description,
                role_order = EXCLUDED.role_order
    ;
