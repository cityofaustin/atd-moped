import React from "react";
import ProjectsMap from "./components/ProjectsMap";

const ProjectsListViewMap = ({ data }) => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  const projectIds = React.useMemo(
    () =>
      data ? data?.project_list_view?.map((project) => project.project_id) : [],
    [data]
  );

  console.log(projectIds);

  return <ProjectsMap ref={mapRef} />;
};

export default ProjectsListViewMap;
