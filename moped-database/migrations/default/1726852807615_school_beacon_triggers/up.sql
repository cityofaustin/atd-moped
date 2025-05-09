CREATE TRIGGER update_feature_school_beacons_council_district BEFORE INSERT OR UPDATE ON
feature_school_beacons FOR EACH ROW EXECUTE FUNCTION update_council_district();
COMMENT ON TRIGGER update_feature_school_beacons_council_district ON feature_school_beacons IS
'Trigger to insert record in feature_council_district table connecting feature_id with corresponding council district id';


-- Trigger for feature_school_beacons table
CREATE TRIGGER feature_school_beacons_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_school_beacons
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "component_id");
COMMENT ON TRIGGER feature_school_beacons_parent_audit_log_trigger ON feature_school_beacons IS 'Trigger to update parent project and component audit fields';


CREATE TRIGGER set_feature_school_beacons_updated_at
BEFORE INSERT OR UPDATE ON feature_school_beacons
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_feature_school_beacons_updated_at ON public.feature_school_beacons IS 'Trigger to set updated_at timestamp for each insert or update on feature_school_beacons';
