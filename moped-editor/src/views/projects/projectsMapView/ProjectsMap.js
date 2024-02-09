import { useRef, useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import BasemapSpeedDial from "../projectView/ProjectComponents/BasemapSpeedDial";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../projectView/ProjectComponents/mapSettings";
import "mapbox-gl/dist/mapbox-gl.css";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function ProjectsMap() {
  const mapRef = useRef();
  const [basemapKey, setBasemapKey] = useState("streets");

  return (
    <MapGL
      ref={mapRef}
      initialViewState={initialViewState}
      mapStyle={basemaps[basemapKey].mapStyle}
      {...mapParameters}
      trackResize={true}
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <NavigationControl position="bottom-left" showCompass={false} />
    </MapGL>
  );
}
