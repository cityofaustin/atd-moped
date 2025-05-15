CREATE TABLE moped_proj_sponsors
  (
     sponsor_name         TEXT NOT NULL,
     sponsor_context      TEXT,
     sponsor_context_file TEXT,
     date_added           TIMESTAMP WITH time zone DEFAULT Clock_timestamp() NOT
     NULL,
     project_sponsor_id   UUID DEFAULT Gen_random_uuid() NOT NULL CONSTRAINT
     moped_project_sponsors_pkey
     PRIMARY KEY,
     sponsor_description  TEXT,
     sponsor_website      TEXT,
     is_external_sponsor  BOOLEAN,
     sponsor_allocation   REAL,
     entity_id            INTEGER,
     project_id           INTEGER NOT NULL CONSTRAINT
     moped_proj_sponsors_project_id_fkey
     REFERENCES moped_project
     ON UPDATE RESTRICT ON DELETE RESTRICT,
     added_by             INTEGER
  ); 

COMMENT ON TABLE moped_proj_sponsors IS
'All sponsors of a moped project regardless of city involvement'; 
