-- Drop the phase_id foreign key
alter table moped_proj_phases drop constraint moped_proj_phases_moped_phases_phase_id_fk;

-- Delete Unknown Phase
DELETE FROM moped_phases WHERE phase_name = 'unknown';


-- Drop the phase_id column
alter table moped_proj_phases drop column phase_id;

-- Re-create the primary key constraint
alter table "public"."moped_proj_phases"
    add constraint "moped_proj_phases_project_phase_id_key"
        unique ("project_phase_id");

-- Re-create foreign key
alter table "public"."moped_proj_phases"
    add foreign key ("phase_name")
        references "public"."moped_phases"("phase_name")
            on update restrict on delete restrict;


