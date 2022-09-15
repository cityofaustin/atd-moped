import MapGL, { Source, Layer, NavigationControl, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { points } from "./points";
import { lines } from "./lines";
import { projectLines } from "./project.lines";
import { projectPoints } from "./project.points";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const projectPointStyle = {
  type: "circle",
  paint: {
    "circle-radius": {
      stops: [
        [10, 1],
        [20, 12],
      ],
    },
    "circle-stroke-color": "#fc0885",
    "circle-stroke-width": 2,
    "circle-stroke-opacity": 0.9,
    "circle-color": "#fc74ba",
    "circle-opacity": 0.9,
  },
};

const projectLineStyle = {
  type: "line",
  paint: {
    "line-width": {
      stops: [
        [10, 1],
        [20, 7],
      ],
    },
    "line-color": "#fc0885",
  },
  layout: {
    "line-cap": "round",
  },
};

const pointStyle = {
  type: "circle",
  paint: {
    "circle-radius": {
      stops: [
        [10, 3],
        [16, 10],
      ],
    },
    "circle-stroke-color": "#fff",
    "circle-stroke-width": 2,
    "circle-stroke-opacity": 0.9,
    "circle-color": "#607d8f",
    "circle-opacity": 0.9,
  },
};

const lineLayerStyle = {
  type: "line",
  paint: {
    "line-width": {
      stops: [
        [10, 1],
        [16, 5],
      ],
    },
    "line-color": "#607d8f",
  },
  layout: {
    "line-cap": "round",
  },
};

const ctnLineStyle = {
  type: "line",
  "source-layer": "ATD_ADMIN.CTN",
  paint: {
    "line-dasharray": [1, 2],
    "line-opacity": 0.4,
    "line-width": {
      stops: [
        [10, 0.5],
        [16, 3],
      ],
    },
    "line-color": "#607d8f",
  },
  layout: {
    "line-cap": "round",
  },
  minzoom: 15,
};

const ctnPointStyle = {
  type: "circle",
  "source-layer": "ATD_ADMIN.CTN_Intersections",
  paint: {
    "circle-radius": {
      stops: [
        [5, 2],
        [16, 6],
      ],
    },

    "circle-stroke-opacity": 0.9,
    "circle-color": "#607d8f",
    "circle-opacity": 0.4,
  },
  minzoom: 15,
};

export const initialViewState = {
  latitude: 30.28,
  longitude: -97.74,
  zoom: 14,
};

/**
 * See: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
 */
export const mapSettings = {
  touchPitch: false,
  dragRotate: false,
  maxBounds: [
    [-99, 29],
    [-96, 32],
  ],
  mapStyle: "mapbox://styles/mapbox/light-v10",
  mapboxAccessToken: MAPBOX_TOKEN,
};

export default function TheMap() {
  //   do not have this data in dummy dataset :/
  lines.features.forEach((feature, index) => {
    feature.properties.component_id = index;
  });
  points.features.forEach((feature, index) => {
    feature.properties.component_id = index;
  });
  const projectLayer = {
    type: "FeatureCollection",
    features: [...projectPoints.features, ...projectLines.features],
  };

  return (
    <MapGL initialViewState={initialViewState} {...mapSettings}>
      <Source id="lines" type="geojson" data={lines}>
        <Layer {...lineLayerStyle} />
      </Source>
      <Source id="points" type="geojson" data={points}>
        <Layer {...pointStyle} />
      </Source>
      <Source
        id="ctn-lines"
        type="vector"
        tiles={[
          "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Segments_MOPED/VectorTileServer/tile/{z}/{y}/{x}.pbf",
        ]}
      >
        <Layer {...ctnLineStyle} />
      </Source>
      <Source
        id="ctn-points"
        type="vector"
        tiles={[
          "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Intersections_MOPED/VectorTileServer/tile/{z}/{y}/{x}.pbf",
        ]}
      >
        <Layer {...ctnPointStyle} />
      </Source>

      <Source id="projectLayer" type="geojson" data={projectLayer}>
        <Layer {...projectLineStyle} />
        <Layer {...projectPointStyle} />
      </Source>
    </MapGL>
  );
}
