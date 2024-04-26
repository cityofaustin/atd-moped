import React from "react";
import { useQuery } from "@apollo/client";
import ProjectsMap from "./components/ProjectsMap";
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

  //   console.log(componentsData);
  console.log(projectsGeographies);

  //   useAllComponentsFeatureCollection

  return <ProjectsMap ref={mapRef} />;
};

export default ProjectsListViewMap;
