ALTER TABLE moped_proj_components_subcomponents ADD CONSTRAINT unique_component_and_subcomponent UNIQUE ("project_component_id", "subcomponent_id");
