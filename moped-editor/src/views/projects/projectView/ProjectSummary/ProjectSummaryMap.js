import React, { useRef, useState } from "react";
import MapGL from "react-map-gl";
import { Box } from "@material-ui/core";
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import BaseMapSourceAndLayers from "../ProjectComponents/BaseMapSourceAndLayers";
import BasemapSpeedDial from "../ProjectComponents/BasemapSpeedDial";
import ProjectSummaryMapSourcesAndLayers from "./ProjectSummaryMapSourcesAndLayers";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../ProjectComponents/mapSettings";
import { countFeatures } from "../../../../utils/mapHelpers";
import "mapbox-gl/dist/mapbox-gl.css";

const ProjectSummaryMap = ({ projectFeatureCollection }) => {
  const mapRef = useRef();
  const [basemapKey, setBasemapKey] = useState("streets");

  const featureCount = countFeatures(projectFeatureCollection);

  // TODO:
  // 1. Add project geography to summary query? Or add here so we only fetch once?
  // 3. Use useZoomToExistingComponents hook to zoom to project geography
  // 4. Update useZoomToExistingComponents to take project geography as a arg instead of data

  return (
    <Box>
      {featureCount > 1 ? (
        <MapGL
          ref={mapRef}
          initialViewState={initialViewState}
          style={{ width: "100%", height: "60vh" }}
          mapStyle={basemaps.streets.mapStyle}
          {...mapParameters}
        >
          <BasemapSpeedDial
            basemapKey={basemapKey}
            setBasemapKey={setBasemapKey}
          />
          <BaseMapSourceAndLayers basemapKey={basemapKey} />
          <ProjectSummaryMapSourcesAndLayers
            projectFeatureCollection={projectFeatureCollection}
          />
        </MapGL>
      ) : (
        <ProjectSummaryMapFallback mapData={projectFeatureCollection} />
      )}
    </Box>
  );
};

export default ProjectSummaryMap;
