-- should_sync_ecapris_statuses will default to false for projects without an eCAPRIS subproject id
update moped_project set should_sync_ecapris_statuses = false where ecapris_subproject_id is null;

alter table "public"."moped_project" alter column "should_sync_ecapris_statuses" set default 'false';
