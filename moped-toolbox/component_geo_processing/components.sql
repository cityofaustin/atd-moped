-- each row is a component
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


SELECT
	*
FROM
	moped_proj_features_components,
	moped_proj_features
WHERE
	moped_proj_features_components.moped_proj_features_id = moped_proj_features.feature_id
	and moped_proj_features.status_id = 1