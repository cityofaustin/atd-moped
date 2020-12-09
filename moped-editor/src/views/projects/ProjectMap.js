import React, { useState } from "react";
import ReactMapGL, { Layer } from "react-map-gl";
import { Typography, makeStyles } from "@material-ui/core";

import {
  createProjectLayerConfig,
  getPolygonId,
  MAPBOX_TOKEN,
  mapInit,
  renderTooltip,
} from "./mapHelpers";

const useStyles = makeStyles(() => ({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  toolTip: {
    position: "absolute",
    margin: 8,
    padding: 4,
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    maxWidth: 300,
    fontSize: "0.875rem",
    fontWeight: 500,
    zIndex: 9,
    pointerEvents: "none",
  },
}));

const ProjectMap = () => {
  const classes = useStyles();

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
    } else {
      setHoveredFeature(null);
      setHoveredCoords(null);
      setPolygonId(null);
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
    <>
      <ReactMapGL
        {...viewport}
        width="100%"
        height={500}
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
        {renderTooltip(hoveredFeature, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {selectedIds.length} locations selected
      </Typography>
    </>
  );
};

export default ProjectMap;
