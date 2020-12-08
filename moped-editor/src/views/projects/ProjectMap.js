import React, { useState, useEffect } from "react";
import ReactMapGL, { Layer } from "react-map-gl";

const MAPBOX_TOKEN = `pk.eyJ1Ijoiam9obmNsYXJ5IiwiYSI6ImNraWV4dHR0ZjAwNnYyd3FwYjFoNHduaDcifQ.--3vRm2KHq1gh5K_L0pqtA`;

const projectLayerConfig = (polygonId, selectedIds) => {
  const hoverId = polygonId;

  return {
    id: "location-polygons",
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
        "case",
        ["==", ["get", "polygon_id"], hoverId],
        "#00AAB1",
        ["in", ["get", "polygon_id"], ["literal", selectedIds]],
        "#1e88e5",
        "#000",
      ],
      "fill-opacity": 0.5,
    },
  };
};

const getPolygonId = e =>
  e.features && e.features.length > 0 && e.features[0].properties.polygon_id;

const ProjectMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 14,
  });
  const [polygonId, setPolygonId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const handleHover = e => {
    const {
      srcEvent: { offsetX, offsetY },
    } = e;

    const polygonId = getPolygonId(e);

    if (!!polygonId) {
      setPolygonId(polygonId);
      setHoveredFeature(polygonId);
      setHoveredCoords({ x: offsetX, y: offsetY });
    }
  };

  const handleClick = e => {
    const polygonId = getPolygonId(e);

    const updatedSelectedIds =
      !!polygonId && !selectedIds.includes(polygonId)
        ? [...selectedIds, polygonId]
        : selectedIds.filter(id => id !== polygonId);

    !!polygonId && setSelectedIds(updatedSelectedIds);
    console.log(e);
  };

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);

  const renderTooltip = () => {
    return (
      hoveredFeature && (
        <div
          className="tooltip"
          style={{
            background: "white",
            left: hoveredCoords?.x,
            top: hoveredCoords?.y,
          }}
        >
          <div>Polygon ID: {hoveredFeature}</div>
        </div>
      )
    );
  };

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height={1000}
      interactiveLayerIds={["location-polygons"]}
      onHover={handleHover}
      onClick={handleClick}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
    >
      <Layer
        key={"location-polygon"}
        {...projectLayerConfig(polygonId, selectedIds)}
      />
      {renderTooltip()}
    </ReactMapGL>
  );
};

export default ProjectMap;
