import React from "react";
import { useQuery } from "@apollo/client";
import ProjectsMap from "./components/ProjectsMap";
import Alert from "@mui/material/Alert";
import { GET_PROJECTS_GEOGRAPHIES } from "src/queries/project";
import { styleMapping } from "../projectView/ProjectStatusBadge";

const ProjectsListViewMap = ({ mapQuery, fetchPolicy }) => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  const { data: projectMapViewData } = useQuery(mapQuery, {
    fetchPolicy,
  });

  const projectDataById = React.useMemo(
    () =>
      projectMapViewData
        ? projectMapViewData?.project_list_view.reduce((acc, project) => {
            return {
              ...acc,
              [project.project_id]: project,
            };
          }, {})
        : {},
    [projectMapViewData]
  );

  const projectIds = React.useMemo(
    () => Object.keys(projectDataById),
    [projectDataById]
  );

  const {
    loading,
    error,
    data: projectsGeographies,
  } = useQuery(GET_PROJECTS_GEOGRAPHIES, { variables: { projectIds } });

  const projectsFeatureCollection = React.useMemo(() => {
    const projectGeographiesFeatureCollection =
      projectsGeographies?.project_geography
        ? projectsGeographies?.project_geography.reduce(
            (acc, projectGeography) => {
              const phaseKey =
                projectDataById[projectGeography.project_id]?.current_phase_key;
              const statusBadgeColor = phaseKey
                ? styleMapping[phaseKey]?.background
                : styleMapping.default.background;

              const projectGeographyFeature = {
                type: "Feature",
                geometry: projectGeography.geography,
                properties: {
                  ...(projectGeography.attributes
                    ? projectGeography.attributes
                    : {}),
                  color: statusBadgeColor,
                },
              };

              return {
                ...acc,
                features: [...acc.features, projectGeographyFeature],
              };
            },
            { type: "FeatureCollection", features: [] }
          )
        : { type: "FeatureCollection", features: [] };

    return projectGeographiesFeatureCollection;
  }, [projectsGeographies, projectDataById]);

  return (
    <>
      {error && <Alert severity="error">{`Unable to load project data`}</Alert>}
      {loading && <Alert severity="info">{`Loading project data...`}</Alert>}
      <ProjectsMap
        ref={mapRef}
        projectsFeatureCollection={projectsFeatureCollection}
        loading={loading}
      />
    </>
  );
};

export default ProjectsListViewMap;
