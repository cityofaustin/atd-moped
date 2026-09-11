ALTER TABLE moped_proj_component_tags ADD CONSTRAINT unique_component_and_tag UNIQUE ("project_component_id", "component_tag_id");
