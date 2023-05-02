alter table "public"."moped_proj_components" add column "name" text;

DROP VIEW "public"."project_geography";

CREATE OR REPLACE VIEW project_geography AS (
    SELECT
        moped_project.project_id AS project_id,
        uniform_features.id AS feature_id,
        moped_components.component_id AS component_archtype_id,
        moped_proj_components.project_component_id AS component_id,
        moped_proj_components.is_deleted,
        moped_project.project_name AS project_name,
        feature_layers.internal_table AS TABLE,
        feature_layers.reference_layer_primary_key_column AS original_fk,
        moped_proj_components.name AS component_name,
        uniform_features.attributes AS attributes,
        uniform_features.geography AS geography
    FROM
        moped_project
        JOIN moped_proj_components ON (moped_proj_components.project_id = moped_project.project_id)
        JOIN moped_components ON (moped_proj_components.component_id = moped_components.component_id)
        JOIN feature_layers ON (moped_components.feature_layer_id = feature_layers.id)
        JOIN uniform_features ON (moped_proj_components.project_component_id = uniform_features.component_id)
        --join component_feature_map on (moped_proj_components.project_component_id = component_feature_map.component_id)
        --join uniform_features on (component_feature_map.feature_id = uniform_features.id)
);

CREATE TABLE "public"."moped_proj_features"("feature_id" integer serial NOT NULL, "project_component_id" integer, "is_deleted" boolean DEFAULT false, PRIMARY KEY ("feature_id") , FOREIGN KEY ("project_component_id");
