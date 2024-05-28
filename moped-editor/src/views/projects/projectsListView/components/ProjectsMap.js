import React, { useState } from "react";
import MapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import BasemapSpeedDial from "../../projectView/ProjectComponents/BasemapSpeedDial";
import BaseMapSourceAndLayers from "../../projectView/ProjectComponents/BaseMapSourceAndLayers";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../../projectView/ProjectComponents/mapSettings";
import { MAP_STYLES } from "./mapStyleSettings";
import "mapbox-gl/dist/mapbox-gl.css";
import theme from "src/theme";
import { styleMapping } from "../../projectView/ProjectStatusBadge";

export default React.forwardRef(function ProjectsMap(
  {
    projectsFeatureCollectionLines,
    projectsFeatureCollectionPoints,
    featuredProjectsFeatureCollectionLines,
    featuredProjectsFeatureCollectionPoints,
    shouldShowFeaturedProjects,
    setFeaturedProjectIds,
  },
  ref
) {
  const [basemapKey, setBasemapKey] = useState("streets");

  /* Handle cursor update on  */
  const [cursor, setCursor] = useState("grab");

  const handleMouseEnter = () => {
    setCursor("pointer");
  };

  const handleMouseLeave = () => {
    setCursor("grab");
  };

  const handleLayerClick = (event) => {
    const clickedFeatures = event.features.length ? event.features : [];
    const clickedFeaturesIds = clickedFeatures.map((feature) => feature.id);

    const uniqueClickedFeaturesIds = [...new Set(clickedFeaturesIds)];
    setFeaturedProjectIds(uniqueClickedFeaturesIds);
  };

  return (
    <MapGL
      ref={ref}
      initialViewState={initialViewState}
      mapStyle={basemaps[basemapKey].mapStyle}
      {...mapParameters}
      reuseMaps
      trackResize
      style={{
        // set MUI style border radius to match the map's container
        borderRadius: theme.spacing(0.5),
      }}
      interactiveLayerIds={[
        "project-lines-outline",
        "project-lines",
        "project-points",
        "project-lines-muted",
        "project-points-muted",
        "project-lines-featured",
        "project-points-featured",
      ]}
      onClick={handleLayerClick}
      cursor={cursor}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <NavigationControl position="bottom-left" showCompass={false} />
      <GeocoderControl position="top-left" marker={false} />
      <BaseMapSourceAndLayers basemapKey={basemapKey} />

      {/* Project line features with status badge color */}
      <Source
        id="projects-geographies-lines"
        type="geojson"
        data={projectsFeatureCollectionLines}
      >
        <Layer
          {...MAP_STYLES["project-lines-outline"].layerProps}
          layout={{
            visibility: !shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-lines-outline"
        />
        <Layer
          {...MAP_STYLES["project-lines"].layerProps}
          paint={{
            ...MAP_STYLES["project-lines"].layerProps.paint,
            "line-color": !shouldShowFeaturedProjects
              ? ["get", "color"]
              : styleMapping.default.background,
          }}
          layout={{
            visibility: !shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-lines"
        />
      </Source>

      {/* Project point features with status badge color */}
      <Source
        id="projects-geographies-points"
        type="geojson"
        data={projectsFeatureCollectionPoints}
      >
        <Layer
          {...MAP_STYLES["project-points"].layerProps}
          paint={{
            ...MAP_STYLES["project-points"].layerProps.paint,
            "circle-color": !shouldShowFeaturedProjects
              ? ["get", "color"]
              : styleMapping.default.background,
          }}
          layout={{
            visibility: !shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-points"
        />
      </Source>

      {/* Muted line project features */}
      <Source
        id="projects-geographies-lines-muted"
        type="geojson"
        data={projectsFeatureCollectionLines}
      >
        <Layer
          {...MAP_STYLES["project-lines-muted"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-lines-muted"
        />
      </Source>

      {/* Muted point project features */}
      <Source
        id="projects-geographies-points-muted"
        type="geojson"
        data={projectsFeatureCollectionPoints}
      >
        <Layer
          {...MAP_STYLES["project-points-muted"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-points-muted"
        />
      </Source>

      {/* Featured line project features */}
      <Source
        id="projects-featured-lines-geographies"
        type="geojson"
        data={featuredProjectsFeatureCollectionLines}
      >
        <Layer
          {...MAP_STYLES["project-lines-outline"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-lines-outline-featured"
        />
        <Layer
          {...MAP_STYLES["project-lines"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-lines-featured"
        />
      </Source>
      {/* Featured line project features */}
      <Source
        id="projects-featured-points-geographies"
        type="geojson"
        data={featuredProjectsFeatureCollectionPoints}
      >
        <Layer
          {...MAP_STYLES["project-points"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-points-featured"
        />
      </Source>
    </MapGL>
  );
});
