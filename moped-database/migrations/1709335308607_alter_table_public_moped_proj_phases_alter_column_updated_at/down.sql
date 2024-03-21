alter table moped_proj_components alter column updated_at drop default;
alter table moped_proj_funding alter column created_at set default clock_timestamp();
alter table moped_proj_funding alter column updated_at drop default;
alter table moped_proj_milestones alter column created_at set default clock_timestamp();
alter table moped_proj_milestones alter column updated_at set drop default;
alter table moped_proj_notes alter column created_at set default clock_timestamp();
alter table moped_proj_notes alter column updated_at drop default;
alter table moped_proj_phases alter column created_at set default clock_timestamp();
alter table moped_proj_phases alter column updated_at drop default;
alter table moped_proj_work_activity alter column updated_at drop default;

CREATE OR REPLACE FUNCTION public.update_self_and_project_updated_audit_fields()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update the updated_at field in the current row of the triggering table
    NEW.updated_at := NOW();

    -- Update the updated_at and updated_by_user_id fields in the related row of moped_project
    UPDATE moped_project
    SET updated_at = NEW.updated_at,
        updated_by_user_id = NEW.updated_by_user_id
    WHERE project_id = NEW.project_id;

    RETURN NEW;
END;
$function$;