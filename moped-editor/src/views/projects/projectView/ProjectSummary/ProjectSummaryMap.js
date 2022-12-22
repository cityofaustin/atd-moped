import React, { useCallback, useState, useMemo } from "react";
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
import { makeFeatureFromProjectGeographyRecord } from "../ProjectComponents/utils/makeFeatureCollections";
import { useZoomToExistingComponents } from "../ProjectComponents/utils/map";
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
      setMapRefState({ current: mapInstance });
    }
  }, []);
  return [mapRef, mapRefState];
};

const ProjectSummaryMap = ({ data }) => {
  const [mapRef, mapRefState] = useMapRef();
  const [basemapKey, setBasemapKey] = useState("streets");

  const projectFeatureCollection = useMemo(() => {
    const featureCollection = {
      type: "FeatureCollection",
      features: [],
    };

    if (!data?.project_geography) return;

    const projectGeographyGeoJSONFeatures = data.project_geography.map(
      (feature) => makeFeatureFromProjectGeographyRecord(feature)
    );

    return { ...featureCollection, features: projectGeographyGeoJSONFeatures };
  }, [data]);

  useZoomToExistingComponents(mapRefState, data);

  const areThereComponentFeatures =
    projectFeatureCollection.features.length > 0;

  return (
    <Box>
      {areThereComponentFeatures ? (
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
        <ProjectSummaryMapFallback />
      )}
    </Box>
  );
};

export default ProjectSummaryMap;
