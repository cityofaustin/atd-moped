import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import ProjectsMap from "./components/ProjectsMap";
import Alert from "@mui/material/Alert";
import { GET_PROJECTS_GEOGRAPHIES } from "src/queries/project";
import { styleMapping } from "../projectView/ProjectStatusBadge";

const ProjectsListViewMap = ({
  mapQuery,
  fetchPolicy,
  setIsMapDataLoading,
}) => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  const { data: projectMapViewData } = useQuery(mapQuery, {
    fetchPolicy,
  });

  /* Build object to get project data needed for projectsFeatureCollection by project id  */
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

  /* Build array of project ids to request project geography */
  const projectIds = React.useMemo(
    () => Object.keys(projectDataById),
    [projectDataById]
  );

  const {
    loading,
    error,
    data: projectsGeographies,
  } = useQuery(GET_PROJECTS_GEOGRAPHIES, { variables: { projectIds } });

  /* Update state tied to loading spinner in SearchBar component */
  useEffect(() => {
    setIsMapDataLoading(loading);
  }, [loading, setIsMapDataLoading]);

  /* Build feature collection to pass to the map, add project_geography attributes to feature properties along with status color */
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
      <ProjectsMap
        ref={mapRef}
        projectsFeatureCollection={projectsFeatureCollection}
        loading={loading}
      />
    </>
  );
};

export default ProjectsListViewMap;
