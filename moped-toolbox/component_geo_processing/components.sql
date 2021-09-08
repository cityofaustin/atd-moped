-- features can be joined to components based on moped_proj_component.project_component_id = moped_proj_features_components.moped_proj_component_id
-- each row is an active (status = 1) component
SELECT
	*
FROM
	moped_proj_components,
	moped_components,
	moped_project
WHERE
	moped_proj_components.component_id = moped_components.component_id AND
	moped_project.project_id = moped_proj_components.project_id
	and moped_proj_components.status_id = 1


-- each row is an active (status = 1) feature
SELECT
	*
FROM
	moped_proj_features_components,
	moped_proj_features
WHERE
	moped_proj_features_components.moped_proj_features_id = moped_proj_features.feature_id
	and moped_proj_features.status_id = 1