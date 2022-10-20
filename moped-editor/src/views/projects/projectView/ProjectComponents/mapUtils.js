import { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import { basemaps, SOURCES } from "./mapSettings";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

export const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (!component || !component?.features) return null;
    return { type: "FeatureCollection", features: component.features };
  }, [component]);

/**
 * Component that renders a Mapbox source and layers needed for the aerial basemap
 * @param {string} basemapKey
 * @returns JSX.Element
 */
export const BaseMapSourceAndLayers = ({ basemapKey }) => {
  // TODO: Address https://github.com/cityofaustin/atd-moped/pull/837#pullrequestreview-1146234061
  // See https://github.com/visgl/react-map-gl/issues/939
  return (
    <>
      <Source {...basemaps.aerial.sources.aerials} />
      <Layer
        {...basemaps.aerial.layers.aerials}
        layout={{ visibility: basemapKey === "aerial" ? "visible" : "none" }}
      />
      {/* show street labels on top of other layers */}
      {/* Use beforeId on other layers to make street labels above everything else */}
      <Layer
        {...{
          ...basemaps.aerial.layers.streetLabels,
          layout: {
            ...basemaps.aerial.layers.streetLabels.layout,
            visibility: basemapKey === "aerial" ? "visible" : "none",
          },
        }}
      />
    </>
  );
};

// There is a config here that sets the order of layers on the map
// Iterate the config and return an array of interactive = true
export const makeInteractiveIds = () => {
  const interactiveLayerIds = [
    "ctn-lines-underlay",
    "project-lines-underlay",
    "ctn-points-underlay",
    "project-points",
    "project-lines-underlay",
  ];

  return {
    interactiveLayerIds,
  };
};

// This component builds sources and layers
// Not dynamic rendering but dynamic visibility use Mapbox style spec
// TODOs
// 1. sources and layers in correct order
export const ProjectComponentsSourcesAndLayers = ({
  data,
  isEditingComponent,
  linkMode,
  clickedComponent,
  componentFeatureCollection,
}) => {
  const {
    ctnLinesGeojson,
    ctnPointsGeojson,
    projectLines,
    projectPoints,
    draftComponentFeatures,
  } = data;

  return (
    <>
      <Source
        id="ctn-lines"
        type="geojson"
        data={ctnLinesGeojson}
        promoteId={SOURCES["ctn-lines"]._featureIdProp}
      >
        <Layer
          {...{
            ...mapStyles["ctn-lines-underlay"].layerProps,
            layout: {
              ...mapStyles["ctn-lines-underlay"].layerProps.layout,
              visibility:
                isEditingComponent && linkMode === "lines" ? "visible" : "none",
            },
          }}
        />

        <Layer
          {...{
            ...mapStyles["ctn-lines"].layerProps,
            layout: {
              ...mapStyles["ctn-lines"].layerProps.layout,
              visibility:
                isEditingComponent && linkMode === "lines" ? "visible" : "none",
            },
          }}
        />
      </Source>

      <Source
        id="ctn-points"
        type="geojson"
        data={ctnPointsGeojson}
        promoteId={SOURCES["ctn-points"]._featureIdProp}
      >
        <Layer
          {...{
            ...mapStyles["ctn-points-underlay"].layerProps,
            layout: {
              visibility:
                isEditingComponent && linkMode === "points"
                  ? "visible"
                  : "none",
            },
          }}
        />
        <Layer
          {...{
            ...mapStyles["ctn-points"].layerProps,
            layout: {
              visibility:
                isEditingComponent && linkMode === "points"
                  ? "visible"
                  : "none",
            },
          }}
        />
      </Source>

      <Source
        id="project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer {...mapStyles["project-lines-underlay"].layerProps} />
        <Layer
          {...mapStyles[
            clickedComponent || isEditingComponent
              ? "project-lines-muted"
              : "project-lines"
          ].layerProps}
        />
      </Source>
      <Source
        id="project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          {...mapStyles[
            clickedComponent || isEditingComponent
              ? "project-points-muted"
              : "project-points"
          ].layerProps}
        />
      </Source>

      <Source
        id="draft-component-lines"
        type="geojson"
        data={draftComponentFeatures}
        promoteId="id"
      >
        <Layer
          {...{
            ...mapStyles["draft-component-lines"].layerProps,
            layout: {
              ...mapStyles["clicked-component-features-lines"].layerProps
                .layout,
              visibility: linkMode ? "visible" : "none",
            },
          }}
        />
      </Source>

      <Source
        id="draft-component-points"
        type="geojson"
        data={draftComponentFeatures}
        promoteId="id"
      >
        <Layer {...mapStyles["draft-component-points"].layerProps} />
      </Source>

      <Source
        id="clicked-component-features"
        type="geojson"
        data={componentFeatureCollection}
        promoteId="id"
      >
        <Layer
          {...{
            ...mapStyles["clicked-component-features-lines"].layerProps,
            layout: {
              ...mapStyles["clicked-component-features-lines"].layerProps
                .layout,
              visibility:
                componentFeatureCollection &&
                clickedComponent.line_representation
                  ? "visible"
                  : "none",
            },
          }}
        />

        <Layer
          {...{
            ...mapStyles["clicked-component-features-points"].layerProps,
            layout: {
              visibility:
                componentFeatureCollection &&
                !clickedComponent.line_representation
                  ? "visible"
                  : "none",
            },
          }}
        />
      </Source>
    </>
  );
};
