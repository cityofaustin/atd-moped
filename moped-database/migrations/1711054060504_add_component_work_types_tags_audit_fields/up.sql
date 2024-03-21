-- Add audit columns to moped_proj_component_work_types
ALTER TABLE moped_proj_component_work_types
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_work_types
ADD CONSTRAINT project_component_work_types_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT project_component_work_types_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Add audit columns to moped_proj_component_tags
ALTER TABLE moped_proj_component_tags
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_component_tags
ADD CONSTRAINT project_component_tags_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT project_component_tags_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);
