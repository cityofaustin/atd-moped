import { Source, Layer } from "react-map-gl";
import { DISTRICTS } from "./districts";
import center from "@turf/center";
const polys = {
  id: "districts-layer",
  type: "fill",
  source: "districts", // reference the data source
  layout: {},
  paint: {
    "fill-color": "#878787", // blue color fill
    "fill-opacity": 0.5,
  },
};

const lines = {
  id: "outline",
  type: "line",
  source: "districts",
  layout: {},
  paint: {
    "line-color": "#000",
    "line-width": 2,
  },
};

const points = {
  id: "points",
  type: "symbol",
  source: "district-points",
  layout: {
    // get the title name from the source's "title" property
    "text-field": ["get", "id"],
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-anchor": "top",
    "text-size": 24,
  },
  paint: {
    "text-halo-color": "#fff",
    "text-halo-width": 5,
  },
};

const labelPoints = {
  type: "FeatureCollection",
  features: DISTRICTS.features.map((f) =>
    center(f, { properties: f.properties })
  ),
};

const DistrictsLayer = ({}) => {
  return (
    <>
      <Source id="districts" type="geojson" data={DISTRICTS}>
        <Layer beforeId="street-labels" {...polys} />
        <Layer beforeId="street-labels" {...lines} />
      </Source>
      <Source id="district-points" type="geojson" data={labelPoints}>
        <Layer beforeId="street-labels" {...points} />
      </Source>
    </>
  );
};

export default DistrictsLayer;
