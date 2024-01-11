DROP TRIGGER set_updated_at_before_update ON moped_proj_funding;

ALTER TABLE moped_proj_funding DROP COLUMN updated_at;
ALTER TABLE moped_proj_funding DROP COLUMN updated_by_user_id;

ALTER TABLE moped_proj_funding RENAME COLUMN created_at TO date_added;
ALTER TABLE moped_proj_funding RENAME COLUMN created_by_user_id TO added_by;
