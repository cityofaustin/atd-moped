import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

const MAPBOX_TOKEN = `pk.eyJ1Ijoiam9obmNsYXJ5IiwiYSI6ImNraWV4dHR0ZjAwNnYyd3FwYjFoNHduaDcifQ.--3vRm2KHq1gh5K_L0pqtA`;

const ProjectMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 11,
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height={1000}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
    />
  );
};

export default ProjectMap;
