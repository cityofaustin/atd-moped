-- Drop the unique index constraint
DROP INDEX moped_project_ecapris_subproject_id_uindex;

-- Create a new unconstrained index
CREATE INDEX moped_project_ecapris_subproject_id_index
    ON moped_project (ecapris_subproject_id);