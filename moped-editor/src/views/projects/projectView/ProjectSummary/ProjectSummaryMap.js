import React, { useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import { Box } from "@mui/material";
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import BaseMapSourceAndLayers from "../ProjectComponents/BaseMapSourceAndLayers";
import BasemapSpeedDial from "../ProjectComponents/BasemapSpeedDial";
import ProjectSourcesAndLayers from "../ProjectComponents/ProjectSourcesAndLayers";
import RelatedProjectSourcesAndLayers from "../ProjectComponents/RelatedProjectSourcesAndLayers";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../ProjectComponents/mapSettings";
import { useZoomToExistingComponents } from "../ProjectComponents/utils/map";
import { useAllComponentsFeatureCollection } from "../ProjectComponents/utils/makeFeatureCollections";
import { useProjectComponents } from "../ProjectComponents/utils/useProjectComponents";
import { useHasMapLoaded } from "../ProjectComponents/utils/useHasMapLoaded";
import { useMapRef } from "../ProjectComponents/utils/useMapRef";
import "mapbox-gl/dist/mapbox-gl.css";

const ProjectSummaryMap = ({ data }) => {
  const [mapRef, mapRefState] = useMapRef();
  const [basemapKey, setBasemapKey] = useState("streets");

  const { projectComponents, childComponents } = useProjectComponents(data);

  const projectComponentsFeatureCollection =
    useAllComponentsFeatureCollection(projectComponents);
  const childComponentsFeatureCollection =
    useAllComponentsFeatureCollection(childComponents);
  const projectAndChildComponentsFeatureCollection =
    useAllComponentsFeatureCollection([
      ...projectComponents,
      ...childComponents,
    ]);

  useZoomToExistingComponents(
    mapRefState,
    projectAndChildComponentsFeatureCollection,
    true
  );

  const areThereComponentFeatures =
    projectComponentsFeatureCollection.features.length > 0 ||
    childComponentsFeatureCollection.features.length > 0;

  const { hasMapLoaded, onMapLoad } = useHasMapLoaded();

  return (
    <Box>
      {areThereComponentFeatures ? (
        <MapGL
          ref={mapRef}
          initialViewState={initialViewState}
          style={{ width: "100%", height: "60vh" }}
          mapStyle={basemaps.streets.mapStyle}
          {...mapParameters}
          cooperativeGestures={true}
          onLoad={onMapLoad}
        >
          <BasemapSpeedDial
            basemapKey={basemapKey}
            setBasemapKey={setBasemapKey}
          />
          <NavigationControl position="bottom-left" showCompass={false} />
          <BaseMapSourceAndLayers basemapKey={basemapKey} />
          {/* Wait until the map loads and components-placeholder layer is ready to target */}
          {hasMapLoaded && (
            <>
              <ProjectSourcesAndLayers
                isCreatingComponent={false}
                isEditingComponent={false}
                isDrawing={false}
                linkMode={null}
                clickedComponent={null}
                projectComponentsFeatureCollection={
                  projectComponentsFeatureCollection
                }
                draftEditComponent={null}
              />
              <RelatedProjectSourcesAndLayers
                isCreatingComponent={false}
                isEditingComponent={false}
                featureCollection={childComponentsFeatureCollection}
                shouldShowRelatedProjects={true}
                clickedComponent={null}
              />
            </>
          )}
        </MapGL>
      ) : (
        <ProjectSummaryMapFallback />
      )}
    </Box>
  );
};

export default ProjectSummaryMap;
