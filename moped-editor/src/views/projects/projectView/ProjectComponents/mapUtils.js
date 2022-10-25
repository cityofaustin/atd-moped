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
 * Iterate through the mapStyles config to create an array of interactive layers
 */
export const interactiveLayerIds = Object.entries(mapStyles).reduce(
  (acc, [key, value]) => {
    if (value.isInteractive) {
      acc.push(key);
    }

    return acc;
  },
  []
);

/**
 * Component that renders Mapbox source and layers needed for the aerial basemap
 * @param {string} basemapKey
 * @returns JSX.Element
 */
export const BaseMapSourceAndLayers = ({ basemapKey }) => {
  return (
    <>
      <Source {...basemaps.aerial.sources.aerials} />
      <Layer
        {...basemaps.aerial.layers.aerials}
        layout={{ visibility: basemapKey === "aerial" ? "visible" : "none" }}
      />
      {/* Always show street labels so they can be the "target" of beforeId 
      and always appear on top of everything else */}
      <Layer
        {...{
          ...basemaps.aerial.layers.streetLabels,
          layout: {
            ...basemaps.aerial.layers.streetLabels.layout,
          },
        }}
      />
    </>
  );
};

/**
 * Component that renders all sources and layers for project components
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} data - GeoJSON data for all project components
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @param {Object} componentFeatureCollection - GeoJSON data for the component clicked
 * @returns JSX.Element
 */
export const ProjectComponentsSourcesAndLayers = ({
  data,
  isEditingComponent,
  linkMode,
  clickedComponent,
  componentFeatureCollection,
}) => {
  // This is a temporary to get data into the map sources
  const {
    ctnLinesGeojson,
    ctnPointsGeojson,
    projectLines,
    projectPoints,
    draftComponentFeatures,
  } = data;

  console.log(clickedComponent);

  return (
    <>
      <Source
        id="ctn-lines"
        type="geojson"
        data={ctnLinesGeojson}
        promoteId={SOURCES["ctn-lines"]._featureIdProp}
      >
        <Layer
          beforeId="street-labels"
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
          beforeId="street-labels"
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
        id="project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["project-lines-underlay"].layerProps,
            layout: {
              ...mapStyles["project-lines-underlay"].layerProps.layout,
              visibility:
                isEditingComponent && linkMode === "lines" ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...mapStyles["project-lines"].layerProps}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["project-lines-muted"].layerProps,
            layout: {
              ...mapStyles["project-lines-muted"].layerProps.layout,
              visibility:
                clickedComponent || isEditingComponent ? "visible" : "none",
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
          beforeId="street-labels"
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
          beforeId="street-labels"
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
        id="project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
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
          beforeId="street-labels"
          {...{
            ...mapStyles["draft-component-lines"].layerProps,
            layout: {
              ...mapStyles["clicked-component-features-lines"].layerProps
                .layout,
              visibility: linkMode === "lines" ? "visible" : "none",
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
        <Layer
          beforeId="street-labels"
          {...mapStyles["draft-component-points"].layerProps}
          layout={{ visibility: linkMode === "points" ? "visible" : "none" }}
        />
      </Source>

      <Source
        id="clicked-component-features"
        type="geojson"
        data={componentFeatureCollection}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
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
          beforeId="street-labels"
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
