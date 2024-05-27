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

const interactiveLayerIds = Object.keys(MAP_STYLES);

export default React.forwardRef(function ProjectsMap(
  {
    projectsFeatureCollection,
    featuredProjectsFeatureCollection,
    shouldShowFeaturedProjects,
    loading,
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
      interactiveLayerIds={interactiveLayerIds}
      onClick={handleLayerClick}
      cursor={cursor}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <NavigationControl position="bottom-left" showCompass={false} />
      <GeocoderControl position="top-left" marker={false} />
      <BaseMapSourceAndLayers basemapKey={basemapKey} />

      {/* Project features with status badge color */}
      <Source
        id="projects-geographies"
        type="geojson"
        data={projectsFeatureCollection}
      >
        <Layer
          {...MAP_STYLES["project-lines-outline"].layerProps}
          layout={{
            visibility: !shouldShowFeaturedProjects ? "visible" : "none",
          }}
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
        />
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
        />
      </Source>

      {/* Muted project features */}
      <Source
        id="projects-geographies-muted"
        type="geojson"
        data={projectsFeatureCollection}
      >
        <Layer
          {...MAP_STYLES["project-lines-muted"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-lines-muted"
        />
        <Layer
          {...MAP_STYLES["project-points-muted"].layerProps}
          layout={{
            visibility: shouldShowFeaturedProjects ? "visible" : "none",
          }}
          id="project-points-muted"
        />
      </Source>

      {/* Featured project features */}
      <Source
        id="projects-featured-geographies"
        type="geojson"
        data={featuredProjectsFeatureCollection}
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
