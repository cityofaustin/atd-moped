import React, { useRef, useState, useMemo } from "react";
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
import "mapbox-gl/dist/mapbox-gl.css";

const ProjectSummaryMap = ({ data }) => {
  const mapRef = useRef();
  const [basemapKey, setBasemapKey] = useState("streets");
  console.log(data);

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

  const areThereComponentFeatures =
    projectFeatureCollection.features.length > 0;

  // TODO:
  // 3. Use useZoomToExistingComponents hook to zoom to project geography
  // 4. Update useZoomToExistingComponents to take project geography as a arg instead of data

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
        <ProjectSummaryMapFallback mapData={projectFeatureCollection} />
      )}
    </Box>
  );
};

export default ProjectSummaryMap;
