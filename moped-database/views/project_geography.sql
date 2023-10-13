-- latest version 1696622988854_add_feature_length_column
CREATE VIEW "public"."project_geography" AS
SELECT
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
  uniform_features.length_feet
FROM
  (
    (
      (
        (
          moped_project
          JOIN moped_proj_components ON (
            (
              moped_proj_components.project_id = moped_project.project_id
            )
          )
        )
        JOIN moped_components ON (
          (
            moped_proj_components.component_id = moped_components.component_id
          )
        )
      )
      JOIN feature_layers ON (
        (
          moped_components.feature_layer_id = feature_layers.id
        )
      )
    )
    JOIN uniform_features ON (
      (
        moped_proj_components.project_component_id = uniform_features.component_id
      )
    )
  );
