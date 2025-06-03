CREATE OR REPLACE VIEW public.project_geography
AS SELECT
    moped_project.project_id,
    uniform_features.id AS feature_id,
    moped_components.component_id AS component_archtype_id,
    moped_proj_components.project_component_id AS component_id,
    moped_proj_components.is_deleted,
    moped_project.project_name,
    feature_layers.internal_table AS "table",
    feature_layers.reference_layer_primary_key_column AS original_fk,
    moped_components.component_name,
    uniform_features.attributes,
    uniform_features.geography,
    uniform_features.council_districts,
    uniform_features.length_feet,
    uniform_features.created_at AS feature_created_at,
    uniform_features.updated_at AS feature_updated_at,
    uniform_features.created_by_user_id AS feature_created_by_user_id,
    uniform_features.updated_by_user_id AS feature_updated_by_user_id
FROM moped_project
INNER JOIN moped_proj_components ON moped_project.project_id = moped_proj_components.project_id
INNER JOIN moped_components ON moped_proj_components.component_id = moped_components.component_id
INNER JOIN feature_layers ON moped_components.feature_layer_id = feature_layers.id
INNER JOIN uniform_features ON moped_proj_components.project_component_id = uniform_features.component_id;

COMMENT ON VIEW public.project_geography IS 'The project_geography view merges project-specific data with the unified geographical features from the uniform_features view. It links projects with their respective geographical components, including type, attributes, and location.'; -- noqa: LT05
