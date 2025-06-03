ALTER TABLE moped_project
ADD project_name_full text GENERATED ALWAYS AS (COALESCE(project_name || ' - ' || project_name_secondary, project_name)) STORED;
