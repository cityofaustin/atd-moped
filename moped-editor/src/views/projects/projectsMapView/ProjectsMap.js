import React, { useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import BasemapSpeedDial from "../projectView/ProjectComponents/BasemapSpeedDial";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../projectView/ProjectComponents/mapSettings";
import "mapbox-gl/dist/mapbox-gl.css";

export default React.forwardRef(function ProjectsMap(_, ref) {
  const [basemapKey, setBasemapKey] = useState("streets");

  return (
    <MapGL
      ref={ref}
      initialViewState={initialViewState}
      mapStyle={basemaps[basemapKey].mapStyle}
      {...mapParameters}
      style={{
        borderTopRightRadius: "4px",
        borderBottomRightRadius: "4px",
      }} // Match the Paper wrapper's border-radius
      reuseMaps
      trackResize
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <NavigationControl position="bottom-left" showCompass={false} />
    </MapGL>
  );
});
