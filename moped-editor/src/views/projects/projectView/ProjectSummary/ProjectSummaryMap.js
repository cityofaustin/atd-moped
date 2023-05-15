import React, { useCallback, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import MapGL from "react-map-gl";
import { Box } from "@mui/material";
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import BaseMapSourceAndLayers from "../ProjectComponents/BaseMapSourceAndLayers";
import BasemapSpeedDial from "../ProjectComponents/BasemapSpeedDial";
import ProjectSummaryMapSourcesAndLayers from "./ProjectSummaryMapSourcesAndLayers";
import ProjectSourcesAndLayers from "../ProjectComponents/ProjectSourcesAndLayers";
import RelatedProjectSourcesAndLayers from "../ProjectComponents/RelatedProjectSourcesAndLayers";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../ProjectComponents/mapSettings";
import { makeFeatureFromProjectGeographyRecord } from "../ProjectComponents/utils/makeFeatureCollections";
import { GET_PROJECT_COMPONENTS } from "src/queries/components";
import { useZoomToExistingComponents } from "../ProjectComponents/utils/map";
import { useAllComponentsFeatureCollection } from "../ProjectComponents/utils/makeFeatureCollections";
import { useProjectComponents } from "../ProjectComponents/utils/useProjectComponents";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * Use a callback ref to get the map instance and store it in state so we can watch it with useEffect
 * @see https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
 * @returns {Array} - [mapRef, mapRefState] - mapRef is a callback ref, mapRefState is a state variable
 */
const useMapRef = () => {
  const [mapRefState, setMapRefState] = useState(null);
  const mapRef = useCallback((mapInstance) => {
    if (mapInstance !== null) {
      // Store instance as the value of current just like a ref would
      setMapRefState({ current: mapInstance });
    }
  }, []);
  return [mapRef, mapRefState];
};

const ProjectSummaryMap = ({ parentProjectId }) => {
  const { projectId } = useParams();
  const [mapRef, mapRefState] = useMapRef();
  const [basemapKey, setBasemapKey] = useState("streets");

  const { data, error } = useQuery(GET_PROJECT_COMPONENTS, {
    variables: {
      projectId,
      ...(parentProjectId && { parentProjectId }),
    },
    fetchPolicy: "no-cache",
  });

  const { projectComponents, childComponents } = useProjectComponents(data);

  const projectComponentsFeatureCollection =
    useAllComponentsFeatureCollection(projectComponents);
  const childComponentsFeatureCollection =
    useAllComponentsFeatureCollection(childComponents);

  useZoomToExistingComponents(mapRefState, data);

  const areThereComponentFeatures =
    projectComponentsFeatureCollection.features.length > 0 ||
    childComponentsFeatureCollection.features.length > 0;

  if (error) console.log(error);

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
        >
          <BasemapSpeedDial
            basemapKey={basemapKey}
            setBasemapKey={setBasemapKey}
          />
          <BaseMapSourceAndLayers basemapKey={basemapKey} />
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
          {/* <ProjectSummaryMapSourcesAndLayers
            projectFeatureCollection={projectFeatureCollection}
          /> */}
        </MapGL>
      ) : (
        <ProjectSummaryMapFallback />
      )}
    </Box>
  );
};

export default ProjectSummaryMap;
