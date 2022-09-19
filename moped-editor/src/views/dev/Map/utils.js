import { useState, useEffect } from "react";
import booleanIntersects from "@turf/boolean-intersects";
import circle from "@turf/circle";

// /**
//  * Fetch a CTN geosjon feature from ArcGIS Online based on it's project_extent_id
//  * @param {String} projectExtentId - The unique ID of the feature to be queried
//  * @param {String} ctnAGOLEndpoint - Base url of the feature service endpoint (global var)
//  * @return {Object} Geojson featureCollection of the queried feature - or null if fetch error
//  */
const defaultParams = {
  where: `1=1`,
  outFields: "*",
  geometryPrecision: 6,
  f: "pgeojson",
  returnGeometry: true,
  inSR: 4326,
  geometryType: "esriGeometryEnvelope",
  spatialRel: "esriSpatialRelEnvelopeIntersects",
};
const getQuerySring = (bounds) => {
  const params = { ...defaultParams, geometry: bounds.join(",") };
  return Object.entries(params)
    .map((param) => `${param[0]}=${encodeURIComponent(param[1])}`)
    .join("&");
};

const ENDPOINT =
  "https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services";

const deDeupeFeatures = (features, featureIdProp) => {
  return features.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (f) => f.properties[featureIdProp] === value.properties[featureIdProp]
      )
  );
};

export const useFeatureService = ({
  name,
  layerId,
  bounds,
  isVisible,
  featureIdProp,
}) => {
  const [geojson, setGeojson] = useState({
    type: "FeatureCollection",
    features: [],
  });
  useEffect(() => {
    if (!bounds || !isVisible) {
      return;
    }
    const queryString = getQuerySring(bounds);
    const url = `${ENDPOINT}/${name}/FeatureServer/${layerId}/query?${queryString}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const allFeatures = [...geojson.features, ...data.features];
        const uniqueFeatures = deDeupeFeatures(allFeatures, featureIdProp);
        setGeojson({
          type: "FeatureCollection",
          features: uniqueFeatures,
        });
      })
      .catch((error) => console.error(error));
  }, [bounds, name, layerId, isVisible, featureIdProp]);
  return geojson;
};

export const getIntersectionLabel = (point, lines) => {
  var radius = 10;
  var options = {
    steps: 10,
    units: "meters",
  };
  var circ = circle(point.geometry.coordinates, radius, options);
  const streets = lines.features
    .filter((lineFeature) =>
      booleanIntersects(lineFeature.geometry, circ.geometry)
    )
    .map((street) => street.properties.FULL_STREET_NAME);
  const uniqueStreets = [...new Set(streets)].sort();
  return uniqueStreets.join(" / ");
};
