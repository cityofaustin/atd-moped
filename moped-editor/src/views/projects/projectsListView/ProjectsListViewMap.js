import React from "react";
import { useQuery } from "@apollo/client";
import ProjectsMap from "./components/ProjectsMap";
import Alert from "@mui/material/Alert";
import {
  GET_PROJECTS_COMPONENTS,
  GET_PROJECTS_GEOGRAPHIES,
} from "src/queries/project";

const ProjectsListViewMap = ({ data }) => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  const projectIds = React.useMemo(
    () =>
      data ? data?.project_list_view?.map((project) => project.project_id) : [],
    [data]
  );

  //   const {
  //     loading,
  //     error,
  //     data: componentsData,
  //   } = useQuery(GET_PROJECTS_COMPONENTS, { variables: { projectIds } });

  const {
    loading,
    error,
    data: projectsGeographies,
  } = useQuery(GET_PROJECTS_GEOGRAPHIES, { variables: { projectIds } });

  /* Translate project geographies returned for filtered projects into a map of feature collection by project ID */
  const projectsFeatureCollections = React.useMemo(() => {
    const projectGeographiesByProjectId =
      projectsGeographies?.project_geography.reduce((acc, projectGeography) => {
        const doesProjectIdExist = acc.hasOwnProperty(
          projectGeography.project_id
        );
        const projectGeographyFeature = {
          type: "Feature",
          geometry: projectGeography.geography,
          properties: projectGeography.attributes,
        };

        if (doesProjectIdExist) {
          return {
            ...acc,
            [projectGeography.project_id]: {
              type: "FeatureCollection",
              features: [
                ...acc[projectGeography.project_id].features,
                projectGeographyFeature,
              ],
            },
          };
        } else {
          return {
            ...acc,
            [projectGeography.project_id]: {
              type: "FeatureCollection",
              features: [projectGeographyFeature],
            },
          };
        }
      }, {});

    return projectGeographiesByProjectId;
  }, [projectsGeographies]);

  return (
    <>
      {error && <Alert severity="error">{`Unable to load project data`}</Alert>}
      <ProjectsMap
        ref={mapRef}
        projectsFeatureCollections={projectsFeatureCollections}
        loading={loading}
      />
    </>
  );
};

export default ProjectsListViewMap;
