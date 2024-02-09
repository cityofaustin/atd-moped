import { useRef, useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import BasemapSpeedDial from "../projectView/ProjectComponents/BasemapSpeedDial";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../projectView/ProjectComponents/mapSettings";
import "mapbox-gl/dist/mapbox-gl.css";

export default function ProjectsMap() {
  const mapRef = useRef();
  const [basemapKey, setBasemapKey] = useState("streets");

  return (
    <MapGL
      ref={mapRef}
      initialViewState={initialViewState}
      mapStyle={basemaps[basemapKey].mapStyle}
      {...mapParameters}
      style={{ borderRadius: "4px" }}
      trackResize
      reuseMaps
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <NavigationControl position="bottom-left" showCompass={false} />
    </MapGL>
  );
}
