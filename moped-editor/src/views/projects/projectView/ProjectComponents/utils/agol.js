import { useEffect, useReducer, useRef } from "react";
import { SOURCES, MIN_SELECT_FEATURE_ZOOM } from "../mapSettings";

/**
 * Provides a hook and supporting functions to query an AGOL feature service
 * given an input bbox. The idea here is to use geojson rather than
 * vector tiles for the ctn-streets layer. All this to work around the
 * problem of feature clipping. I'm seeing edge cases where this does
 * not seem to be foolproof - some features still appear to be clipped.
 */
const AGOL_ENDPOINT =
  "https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services";

const DEFAULT_FEATURE_SERVICE_PARAMS = {
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
  const params = {
    ...DEFAULT_FEATURE_SERVICE_PARAMS,
    geometry: bounds.join(","),
  };
  return Object.entries(params)
    .map((param) => `${param[0]}=${encodeURIComponent(param[1])}`)
    .join("&");
};

const deDedupeFeatures = (features, featureIdProp) => {
  // courtesy of: https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
  return features.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (f) => f.properties[featureIdProp] === value.properties[featureIdProp]
      )
  );
};

/* accumulates new features into the geojson state - a state depending
on a previous state is a great use case for useReducer, because
it allows us to work around an infinite recursion scenario in useEffect  */
const featureReducer = (geojson, { features, featureIdProp }) => {
  const currentFeatures = geojson.features.length > 0 ? geojson.features : [];
  const newFeatures = features.length > 0 ? features : [];

  const allFeatures = [...currentFeatures, ...newFeatures];
  const uniqueFeatures = deDedupeFeatures(allFeatures, featureIdProp);
  return { type: "FeatureCollection", features: uniqueFeatures };
};

/**
 * Find a fetched AGOL feature record by unique ID
 * @param {Object} clickedFeature - the feature clicked on the map
 * @param {String} linkMode - the current link mode ("lines" or "points")
 * @param {Object} ctnLinesGeojson - Feature collection containing query results for CTN lines
 * @param {Object} ctnPointsGeojson - Feature collection containing query results for CTN points
 * @returns {Object} - a feature object from AGOL data
 */
export const findFeatureInAgolGeojsonFeatures = (
  clickedFeature,
  linkMode,
  ctnLinesGeojson,
  ctnPointsGeojson
) => {
  if (linkMode === "lines") {
    const linesIdProperty = SOURCES["ATD_ADMIN.CTN"]._featureIdProp;
    const clickedFeatureId = clickedFeature.properties[linesIdProperty];

    return ctnLinesGeojson.features.find(
      (feature) => feature.properties[linesIdProperty] === clickedFeatureId
    );
  } else if (linkMode === "points") {
    const pointsIdProperty =
      SOURCES["ATD_ADMIN.CTN_Intersections"]._featureIdProp;
    const clickedFeatureId = clickedFeature.properties[pointsIdProperty];

    return ctnPointsGeojson.features.find(
      (feature) => feature.properties[pointsIdProperty] === clickedFeatureId
    );
  }
};

/**
 * Fetch CTN lines and points and a helper to find a feature record that matches a clicked layer feature by ID
 * @param {String} linkMode - tracks if we are editing "lines" or "points"
 * @param {Function} setIsFetchingFeatures - toggle loading state of the header spinner
 * @param {Number} currentZoom - current level of zoom in the map
 * @param {Array} bounds - the current map bounds
 * @returns {AgolFeaturesObject}
 */
/**
 * @typedef {Object} AgolFeaturesObject
 * @property {Object} ctnLinesGeojson - Feature collection containing query results for CTN lines
 * @property {Object} ctnPointsGeojson - Feature collection containing query results for CTN points
 */
export const useAgolFeatures = (
  linkMode,
  setIsFetchingFeatures,
  currentZoom,
  bounds
) => {
  const ctnLinesGeojson = useFeatureService({
    layerId: SOURCES["ATD_ADMIN.CTN"].featureService.layerId,
    name: SOURCES["ATD_ADMIN.CTN"].featureService.name,
    bounds,
    isVisible: linkMode === "lines" && currentZoom >= MIN_SELECT_FEATURE_ZOOM,
    featureIdProp: SOURCES["ATD_ADMIN.CTN"]._featureIdProp,
    setIsFetchingFeatures,
  });

  const ctnPointsGeojson = useFeatureService({
    layerId: SOURCES["ATD_ADMIN.CTN_Intersections"].featureService.layerId,
    name: SOURCES["ATD_ADMIN.CTN_Intersections"].featureService.name,
    bounds,
    isVisible: linkMode === "points" && currentZoom >= MIN_SELECT_FEATURE_ZOOM,
    featureIdProp: SOURCES["ATD_ADMIN.CTN_Intersections"]._featureIdProp,
    setIsFetchingFeatures,
  });

  return {
    ctnLinesGeojson,
    ctnPointsGeojson,
  };
};

/* Hook which AGOL rest service for features within a bbox, and continuously
accumulates those features into a single FeatureCollection. This way we can
seamlessly persist already-queried features on the map. It's a touch risky,
since the memory load can get high and possibly leaky. Definitely makes you
appreciate vector tiles. 

A key limitation of this approach is that AGOL limits how many features it will 
return - i beleive its 2k, so we need restrict queries to only run when the map
is at a zoom level we're confident contains fewer than 2k features. 

If we decide this approach holds water, we could look into optimizations. One 
idea is to keep track of the cumulative bounding box of the map that we have
already queried - then we can avoid requerying bboxes we already have in
memory.
*/
export const useFeatureService = ({
  name,
  layerId,
  bounds,
  isVisible,
  featureIdProp,
  setIsFetchingFeatures,
}) => {
  const [geojson, dispatchFeatureUpdate] = useReducer(featureReducer, {
    type: "FeatureCollection",
    features: [],
  });

  const controllerRef = useRef();

  useEffect(() => {
    if (!bounds || !isVisible) {
      return;
    }
    setIsFetchingFeatures(true);

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    const queryString = getQuerySring(bounds);
    // AGOL provides a GUI for testing this REST service. follow this URL to check it out
    const url = `${AGOL_ENDPOINT}/${name}/FeatureServer/${layerId}/query?${queryString}`;

    fetch(url, { signal: controllerRef.current?.signal })
      .then((response) => response.json())
      .then((data) => {
        dispatchFeatureUpdate({ features: data.features, featureIdProp });
        setIsFetchingFeatures(false);
        controllerRef.current = null;
      })
      .catch((error) => {
        if (error instanceof DOMException) {
          console.warn("AGOL fetch aborted by newer request");
          setIsFetchingFeatures(false);
        } else {
          console.error(error);
          setIsFetchingFeatures(false);
        }
      });
  }, [
    bounds,
    name,
    layerId,
    isVisible,
    featureIdProp,
    setIsFetchingFeatures,
    dispatchFeatureUpdate,
  ]);
  return geojson;
};
