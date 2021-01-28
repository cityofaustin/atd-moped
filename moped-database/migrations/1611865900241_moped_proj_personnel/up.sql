ALTER TABLE moped_proj_personnel
    ADD CONSTRAINT moped_proj_personnel_role_name_fk
        FOREIGN KEY (role_name) REFERENCES moped_project_roles (project_role_name);
