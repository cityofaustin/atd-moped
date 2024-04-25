import React from "react";
import ProjectsMap from "./ProjectsMap";

const ProjectListViewMap = () => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  return <ProjectsMap ref={mapRef} />;
};

export default ProjectListViewMap;
