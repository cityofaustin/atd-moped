import React from "react";
import theme from "../../theme/index";
import { isEqual } from "lodash";

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const mapInit = {
  latitude: 30.268039,
  longitude: -97.742828,
  zoom: 12,
};

export const getVectorTilePolygonId = e =>
  e.features && e.features.length > 0 && e.features[0].properties.polygon_id;

export const getLayerSource = e =>
  e.features && e.features.length > 0 && e.features[0].layer["source-layer"];

export const getLayerGeometry = e =>
  e.features && e.features.length > 0 && e.features[0].geometry;

export const getGeoJSON = e =>
  e.features &&
  e.features.length > 0 && {
    geometry: e.features[0].geometry,
    id: e.features[0].id,
    properties: {
      ...e.features[0].properties,
      sourceLayer: e.features[0].sourceLayer,
      source: e.features[0].source,
    },
    type: e.features[0].type,
  };

export const isFeaturePresent = (selectedFeature, features) =>
  features.some(feature => isEqual(selectedFeature, feature));

export const createProjectLayerConfig = (
  polygonId,
  layerSourceName,
  selectedIds
) => {
  const hoverId = polygonId;
  const layerIds = selectedIds[layerSourceName] || [];

  return {
    id: "location-polygons",
    type: "fill",
    source: {
      type: "vector",
      tiles: [
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/location_polygons_vector_tiles_w_IDs/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      ],
    },
    "source-layer": layerSourceName,
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "polygon_id"], hoverId],
        theme.palette.map.selected,
        ["in", ["get", "polygon_id"], ["literal", layerIds]],
        theme.palette.primary.main,
        theme.palette.map.transparent,
      ],
      "fill-opacity": 0.4,
    },
  };
};

export const renderTooltip = (hoveredFeature, hoveredCoords, className) => {
  return (
    hoveredFeature && (
      <div
        className={className}
        style={{
          left: hoveredCoords?.x,
          top: hoveredCoords?.y,
        }}
      >
        <div>Polygon ID: {hoveredFeature}</div>
      </div>
    )
  );
};

export const sumFeaturesSelected = selectedIdsObj =>
  Object.values(selectedIdsObj).reduce(
    (acc, selectedIds) => (acc += selectedIds.length),
    0
  );
