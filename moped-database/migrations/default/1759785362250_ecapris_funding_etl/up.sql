-- Switch on sync for projects with ecapris_subproject_id set
UPDATE moped_project SET should_sync_ecapris_funding = TRUE
WHERE ecapris_subproject_id IS NOT NULL;
