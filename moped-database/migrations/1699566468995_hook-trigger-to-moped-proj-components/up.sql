CREATE TRIGGER set_updated_at_before_update
AFTER UPDATE ON moped_proj_components
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
