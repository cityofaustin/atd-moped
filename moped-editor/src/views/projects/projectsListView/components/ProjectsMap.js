import React, { useState } from "react";
import MapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import BasemapSpeedDial from "../../projectView/ProjectComponents/BasemapSpeedDial";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../../projectView/ProjectComponents/mapSettings";
import { MAP_STYLES } from "../../projectView/ProjectComponents/mapStyleSettings";
import "mapbox-gl/dist/mapbox-gl.css";

export default React.forwardRef(function ProjectsMap(
  { projectsFeatureCollection },
  ref
) {
  const [basemapKey, setBasemapKey] = useState("streets");

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

      <Source
        id="projects-geographies"
        type="geojson"
        data={projectsFeatureCollection}
      >
        <Layer {...MAP_STYLES["project-lines"].layerProps} />
        <Layer {...MAP_STYLES["project-points"].layerProps} />
      </Source>
    </MapGL>
  );
});
