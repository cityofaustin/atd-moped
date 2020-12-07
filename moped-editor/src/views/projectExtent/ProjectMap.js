import React, { useState } from "react";
import ReactMapGL, { Layer } from "react-map-gl";

const MAPBOX_TOKEN = `pk.eyJ1Ijoiam9obmNsYXJ5IiwiYSI6ImNraWV4dHR0ZjAwNnYyd3FwYjFoNHduaDcifQ.--3vRm2KHq1gh5K_L0pqtA`;

const projectLayerConfig = () => {
  const hoverId = "636894224092";

  return {
    id: "location-polygons",
    // beforeId: "base-layer",
    type: "fill",
    source: {
      type: "vector",
      tiles: [
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/location_polygons_vector_tiles_w_IDs/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      ],
    },
    "source-layer": "asmp_polygons",
    paint: {
      "fill-outline-color": "#000000",
      "fill-color": [
        "match",
        ["get", "polygon_id"],
        hoverId,
        "#00AAB1",
        "#000",
      ],
      "fill-opacity": 0.5,
    },
    // filter: ["==", "_symbol", parameters.filter],
    // layout: {
    //   "line-cap": "round",
    //   "line-join": "round",
    //   visibility: `${
    //     overlay.options && overlay.options.includes(asmpLevel)
    //       ? "visible"
    //       : "none"
    //   }`,
    // },
    // paint: {
    //   "line-color": parameters.color,
    //   "line-width": 2,
    // },
  };
};

const ProjectMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 14,
  });

  const handleClick = e => {
    debugger;
  };

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height={1000}
      interactiveLayerIds={["location-polygons"]}
      onClick={handleClick}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
    >
      <Layer key={"location-polygon"} {...projectLayerConfig()} />
    </ReactMapGL>
  );
};

export default ProjectMap;
