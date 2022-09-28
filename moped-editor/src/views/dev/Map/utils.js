import { useState, useEffect, useMemo } from "react";
import { cloneDeep } from "lodash";
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
  setIsFetchingFeatures,
}) => {
  const [geojson, setGeojson] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [controller, setController] = useState(new AbortController());

  useEffect(() => {
    if (!bounds || !isVisible) {
      return;
    }
    setIsFetchingFeatures(true);
    const queryString = getQuerySring(bounds);
    const url = `${ENDPOINT}/${name}/FeatureServer/${layerId}/query?${queryString}`;

    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        const allFeatures = [...geojson.features, ...data.features];
        // TODO: dedupe features in a separate hook - this hook should only fetch data!
        const uniqueFeatures = deDeupeFeatures(allFeatures, featureIdProp);
        setGeojson({
          type: "FeatureCollection",
          features: uniqueFeatures,
        });
        setIsFetchingFeatures(false);
      })
      .catch((error) => {
        if (error instanceof DOMException) {
          console.warn("Aborted requested");
        } else {
          console.error(error);
        }
      });

    return () => {
      // cancel this request on next render
      controller.abort();
      setController(new AbortController());
      setIsFetchingFeatures(false);
    };
  }, [bounds, name, layerId, isVisible, featureIdProp, setIsFetchingFeatures]);
  return geojson;
};

export const useFeatureTypes = (featureCollection, geomType) =>
  useMemo(() => {
    const features = featureCollection.features.filter((feature) => {
      const thisGeom = feature.geometry.type.toLowerCase();
      return thisGeom.includes(geomType);
    });
    return { type: "FeatureCollection", features };
  }, [featureCollection, geomType]);

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

export const handleNewComponentFeatureLink = (
  componentFeatures,
  selectedFeatures,
  componentIdsToLink
) => {
  /**
   * let's assume componentFeatures is an object that looks like this
   * {
   *  features:
   *    [
   *      id: <someVal>,
   *      components: <array of component ids>
   *     ]
   *   }
   * }
   */

  // make a new copy, then we can rely on object references to keep things tidy
  const newComponentFeatures = cloneDeep(componentFeatures);
  // add the selected components to the features
  const existingFeaturesWithLinks = newComponentFeatures.features;
  selectedFeatures.forEach((thisFeature) => {
    // is this feature already known to componentFeatures?
    const isExistingFeature = existingFeaturesWithLinks.find(
      (existingFeature) => existingFeature.id === thisFeature.properties.id
    );
    if (isExistingFeature) {
      // add all of the current component IDs to it
      isExistingFeature.components = [
        ...isExistingFeature.components,
        ...componentIdsToLink,
      ];
      // and lazily de-dupe it
      isExistingFeature.components = [...new Set(isExistingFeature.components)];
    } else {
      // this feature previously had 0 components - add them
      existingFeaturesWithLinks.push({
        id: thisFeature.properties.id,
        components: [...componentIdsToLink],
      });
    }
  });
  return newComponentFeatures;
};

/**
 * Return "line", "point", or null if all feature are/are not of the same type
 * ...in which case we do not need to show link mode dialog
 */
export const useIsUniformGeometryType = (features) =>
  useMemo(() => {
    if (!features || features.length === 0) {
      return null;
    }
    // handling Point, Line, MultiPoint, and MultiLine
    const featureTypes = features.map((feature) => {
      if (feature.geometry.type.toLowerCase().includes("line")) {
        return "lines";
      } else if (feature.geometry.type.toLowerCase().includes("point")) {
        return "points";
      } else {
        throw `Unsupported geometry type ${feature.geomtery.type}`;
      }
    });
    // are all values the same?
    const isUniform = featureTypes.every((b) => b === featureTypes[0]);
    if (isUniform) {
      return featureTypes[0];
    } else {
      return null;
    }
  }, [features]);

export const COMPONENT_FORM_FIELDS = [
  {
    key: "type",
    label: "Component Type",
    type: "autocomplete",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
  },
];

export const initialComponentFormState = COMPONENT_FORM_FIELDS.reduce((prev, curr) => {
  prev[curr.key] = "";
  return prev;
}, {});

export function componentFormStateReducer(state, { key, value, action }) {
  if (action === "update") {
    return { ...state, [key]: value };
  } else {
    return initialComponentFormState;
  }
}
