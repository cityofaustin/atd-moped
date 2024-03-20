alter table feature_drawn_lines alter column updated_at drop default;
alter table feature_drawn_points alter column updated_at drop default;
alter table feature_intersections alter column updated_at drop default;
alter table feature_signals alter column updated_at drop default;
alter table feature_street_segments alter column updated_at drop default;
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

CREATE TRIGGER set_feature_drawn_lines_updated_at
    BEFORE UPDATE ON feature_drawn_lines
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_feature_drawn_points_updated_at
    BEFORE UPDATE ON feature_drawn_points
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_feature_intersections_updated_at
    BEFORE UPDATE ON feature_intersections
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_feature_signals_updated_at
    BEFORE UPDATE ON feature_signals
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_feature_street_segments_updated_at
    BEFORE UPDATE ON feature_street_segments
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_moped_proj_components_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_components
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

CREATE TRIGGER update_moped_proj_funding_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_funding
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

CREATE TRIGGER update_moped_proj_milestones_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

CREATE TRIGGER update_moped_proj_notes_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

CREATE TRIGGER update_moped_proj_phases_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_phases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

CREATE TRIGGER update_moped_proj_work_activity_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_work_activity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();
