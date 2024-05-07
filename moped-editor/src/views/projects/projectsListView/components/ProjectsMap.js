import React, { useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import BasemapSpeedDial from "../../projectView/ProjectComponents/BasemapSpeedDial";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../../projectView/ProjectComponents/mapSettings";
import "mapbox-gl/dist/mapbox-gl.css";

export default React.forwardRef(function ProjectsMap(
  { projectsFeatureCollections, loading },
  ref
) {
  const [basemapKey, setBasemapKey] = useState("streets");

  console.log({ projectsFeatureCollections, loading });

  return (
    <MapGL
      ref={ref}
      initialViewState={initialViewState}
      mapStyle={basemaps[basemapKey].mapStyle}
      {...mapParameters}
      reuseMaps
      trackResize
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <NavigationControl position="bottom-left" showCompass={false} />
      <GeocoderControl position="top-left" marker={false} />
    </MapGL>
  );
});
