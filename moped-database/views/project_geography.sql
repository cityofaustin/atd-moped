-- latest version: 1666978291816_add_component_geometry_tables
create or replace view project_geography as (
    select 
      moped_project.project_id as project_id,
      uniform_features.id as feature_id,
      moped_components.component_id as component_archtype_id,
      moped_proj_components.project_component_id as component_id,
      moped_proj_components.is_deleted,
      moped_project.project_name as project_name,
      feature_layers.internal_table as table,
      feature_layers.reference_layer_primary_key_column as original_fk,
      moped_proj_components.name as component_name,
      uniform_features.name as feature_name,
      uniform_features.attributes as attributes,
      uniform_features.geography as geography
    from moped_project
    join moped_proj_components on (moped_proj_components.project_id = moped_project.project_id)
    join moped_components on (moped_proj_components.component_id = moped_components.component_id)
    join feature_layers on (moped_components.feature_layer_id = feature_layers.id)
    join uniform_features on (moped_proj_components.project_component_id = uniform_features.component_id)
    --join component_feature_map on (moped_proj_components.project_component_id = component_feature_map.component_id)
    --join uniform_features on (component_feature_map.feature_id = uniform_features.id)
);
