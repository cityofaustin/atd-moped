const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
// This API key is managed by CTM. Contact help desk for maintenance and troubleshooting.
const NEARMAP_KEY = process.env.REACT_APP_NEARMAP_TOKEN;

// minimum map zoom to display selectable features, and
// also to query AGOL for them
export const MIN_SELECT_FEATURE_ZOOM = 15;

export const SOURCES = {
  "ctn-lines": {
    id: "ctn-lines",
    featureService: {
      name: "CTN_Segments_MOPED_FS",
      layerId: 0,
    },
    _featureIdProp: "CTN_SEGMENT_ID",
    minZoom: MIN_SELECT_FEATURE_ZOOM,
  },
  "ctn-points": {
    id: "ctn-points",
    featureService: {
      name: "LOCATION_coa_intersection_points",
      layerId: 0,
    },
    _featureIdProp: "INTERSECTION_ID",
    minZoom: MIN_SELECT_FEATURE_ZOOM,
  },
};

export const initialViewState = {
  latitude: 30.28,
  longitude: -97.74,
  zoom: 15,
};

/**
 * @see https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
 */
export const mapParameters = {
  touchPitch: false,
  dragRotate: false,
  maxBounds: [
    [-99, 29],
    [-96, 32],
  ],
  mapboxAccessToken: MAPBOX_TOKEN,
};

/**
 * This configuration sets the mapStyle, sources, and layers for streets and aerial basemaps.
 * The react-map-gl map's mapStyle prop is passed the value of the mapStyle key in this config.
 * @see https://visgl.github.io/react-map-gl/docs/api-reference/map#mapstyle
 */
export const basemaps = {
  streets: { mapStyle: "mapbox://styles/mapbox/light-v10" },
  // Provide style parameters to render Nearmap tiles in react-map-gl
  // https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
  aerial: {
    mapStyle: "mapbox://styles/mapbox/satellite-streets-v11",
    sources: {
      aerials: {
        id: "raster-tiles",
        type: "raster",
        tiles: [
          `https://api.nearmap.com/tiles/v3/Vert/{z}/{x}/{y}.jpg?apikey=${NEARMAP_KEY}`,
        ],
        tileSize: 256,
      },
    },
    layers: {
      aerials: {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
      streetLabels: {
        // borrowed from mapbox mapbox streets v11 style
        type: "symbol",
        metadata: {
          "mapbox:featureComponent": "road-network",
          "mapbox:group": "Road network, road-labels",
        },
        source: "composite",
        "source-layer": "road",
        minzoom: 12,
        filter: [
          "all",
          ["has", "name"],
          [
            "match",
            ["get", "class"],
            [
              "motorway",
              "trunk",
              "primary",
              "secondary",
              "tertiary",
              "street",
              "street_limited",
            ],
            true,
            false,
          ],
        ],
        layout: {
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            [
              "match",
              ["get", "class"],
              ["motorway", "trunk", "primary", "secondary", "tertiary"],
              10,
              9,
            ],
            18,
            [
              "match",
              ["get", "class"],
              ["motorway", "trunk", "primary", "secondary", "tertiary"],
              16,
              14,
            ],
          ],
          "text-max-angle": 30,
          "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
          "symbol-placement": "line",
          "text-padding": 1,
          "text-rotation-alignment": "map",
          "text-pitch-alignment": "viewport",
          "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
          "text-letter-spacing": 0.01,
        },
        paint: {
          "text-color": "#fff",
          "text-halo-color": "#000",
          "text-halo-width": 1,
        },
      },
    },
  },
};
