-- Drop the unconstrained index
DROP INDEX moped_project_ecapris_subproject_id_index;

-- Create the unique index constraint
CREATE UNIQUE INDEX moped_project_ecapris_subproject_id_uindex
    ON moped_project (ecapris_subproject_id);