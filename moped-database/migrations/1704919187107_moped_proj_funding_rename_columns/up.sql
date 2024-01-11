ALTER TABLE moped_proj_funding RENAME COLUMN date_added TO created_at;
ALTER TABLE moped_proj_funding RENAME COLUMN added_by TO created_by_user_id;

ALTER TABLE moped_proj_funding ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE moped_proj_funding ADD COLUMN updated_by_user_id INTEGER;

COMMENT ON COLUMN moped_proj_funding.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_proj_funding.updated_by_user_id IS 'ID of the user who last updated the record';

CREATE TRIGGER set_updated_at_before_update
BEFORE UPDATE ON moped_proj_funding
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_updated_at_before_update ON moped_proj_funding IS 'Trigger to update the updated_at field with the current timestamp before each update operation.';