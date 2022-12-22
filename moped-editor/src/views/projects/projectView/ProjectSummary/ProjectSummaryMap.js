import React, { useRef } from "react";
import MapGL from "react-map-gl";
import { Box } from "@material-ui/core";
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import ProjectSourcesAndLayers from "../ProjectComponents/ProjectSourcesAndLayers";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../ProjectComponents/mapSettings";
import { countFeatures } from "../../../../utils/mapHelpers";
import "mapbox-gl/dist/mapbox-gl.css";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const ProjectSummaryMap = ({ projectFeatureCollection }) => {
  const mapRef = useRef();
  const featureCount = countFeatures(projectFeatureCollection);

  // TODO:
  // 1. Add project geography to summary query? Or add here so we only fetch once?
  // 2. Update map to use the project geography
  // 3. Use useZoomToExistingComponents hook to zoom to project geography
  // 4. Update useZoomToExistingComponents to take project geography as a arg instead of data
  // 5. Update map so it has same limitations as the project map (no zooming out past a certain point, etc)

  /**
   * If we do have features, proceed to render map.
   */
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
          <ProjectSourcesAndLayers
            isCreatingComponent={isCreatingComponent}
            isEditingComponent={isEditingComponent}
            isDrawing={isDrawing}
            linkMode={linkMode}
            clickedComponent={clickedComponent}
            projectComponentsFeatureCollection={
              projectComponentsFeatureCollection
            }
            draftEditComponent={draftEditComponent}
          />
        </MapGL>
      ) : (
        <ProjectSummaryMapFallback mapData={projectFeatureCollection} />
      )}
    </Box>
  );
};

export default ProjectSummaryMap;
