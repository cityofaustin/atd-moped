-- populate proj_feature <> component fk (project_component_id) from previous
-- associative table (moped_proj_features_components)
update moped_proj_features
	set project_component_id = moped_proj_features_components.moped_proj_component_id
	from moped_proj_features_components
	where moped_proj_features_components.moped_proj_features_id = moped_proj_features.feature_id;

-- and now it's safe to require project_component_id for all features
ALTER TABLE "public"."moped_proj_features" ALTER COLUMN "project_component_id" SET NOT NULL;
