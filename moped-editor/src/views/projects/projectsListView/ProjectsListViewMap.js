import React from "react";
import ProjectsMap from "./components/ProjectsMap";

const ProjectsListViewMap = () => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  return <ProjectsMap ref={mapRef} />;
};

export default ProjectsListViewMap;
