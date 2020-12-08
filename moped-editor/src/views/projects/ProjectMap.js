import React, { useState, useEffect } from "react";
import ReactMapGL, { Layer } from "react-map-gl";
import {
  createProjectLayerConfig,
  getPolygonId,
  MAPBOX_TOKEN,
  mapInit,
  renderTooltip,
} from "./mapHelpers";

const ProjectMap = () => {
  const [viewport, setViewport] = useState(mapInit);
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
        {...createProjectLayerConfig(polygonId, selectedIds)}
      />
      {renderTooltip(hoveredFeature, hoveredCoords)}
    </ReactMapGL>
  );
};

export default ProjectMap;
