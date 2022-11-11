import { Source, Layer } from "react-map-gl";
import { SOURCES } from "./mapSettings";
import { MAP_STYLES } from "./mapStyleSettings";

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
const ComponentsSourcesAndLayers = ({
  data,
  isEditingComponent,
  linkMode,
  clickedComponent,
  componentFeatureCollection,
  isDrawing,
}) => {
  // This is a temporary to get data into the map sources
  const {
    ctnLinesGeojson,
    ctnPointsGeojson,
    projectLines,
    projectPoints,
    draftComponentFeatures,
  } = data;

  const isViewingComponents = !isEditingComponent && !clickedComponent;
  const isEditingLines =
    isEditingComponent && linkMode === "lines" && !isDrawing;
  const isEditingPoints =
    isEditingComponent && linkMode === "points" && !isDrawing;
  const shouldShowMutedFeatures = clickedComponent || isEditingComponent;

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
            ...MAP_STYLES["ctn-lines-underlay"].layerProps,
            layout: {
              ...MAP_STYLES["ctn-lines-underlay"].layerProps.layout,
              visibility: isEditingLines ? "visible" : "none",
            },
          }}
        />

        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["ctn-lines"].layerProps,
            layout: {
              ...MAP_STYLES["ctn-lines"].layerProps.layout,
              visibility: isEditingLines ? "visible" : "none",
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
            ...MAP_STYLES["project-lines-underlay"].layerProps,
            layout: {
              ...MAP_STYLES["project-lines-underlay"].layerProps.layout,
              visibility: isEditingLines ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["project-lines"].layerProps,
            layout: {
              ...MAP_STYLES["project-lines"].layerProps.layout,
              visibility: isViewingComponents ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["project-lines-muted"].layerProps,
            layout: {
              ...MAP_STYLES["project-lines-muted"].layerProps.layout,
              visibility: shouldShowMutedFeatures ? "visible" : "none",
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
            ...MAP_STYLES["ctn-points-underlay"].layerProps,
            layout: {
              visibility: isEditingPoints ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["ctn-points"].layerProps,
            layout: {
              visibility: isEditingPoints ? "visible" : "none",
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
          {...{
            ...MAP_STYLES["project-points"].layerProps,
            layout: {
              ...MAP_STYLES["project-points"].layerProps.layout,
              visibility: isViewingComponents ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["project-points-muted"].layerProps,
            layout: {
              visibility: shouldShowMutedFeatures ? "visible" : "none",
            },
          }}
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
            ...MAP_STYLES["draft-component-lines"].layerProps,
            layout: {
              ...MAP_STYLES["clicked-component-features-lines"].layerProps
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
          {...MAP_STYLES["draft-component-points"].layerProps}
          layout={{ visibility: linkMode === "points" ? "visible" : "none" }}
        />
      </Source>

      <Source
        id="clicked-component-features"
        type="geojson"
        data={componentFeatureCollection}
        promoteId="id"
      >
        {/* render type as property to switch this on and off */}
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["clicked-component-features-lines"].layerProps,
            filter: ["==", ["get", "render_type"], "line"],
            layout: {
              ...MAP_STYLES["clicked-component-features-lines"].layerProps
                .layout,
              visibility: componentFeatureCollection ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["clicked-component-features-points"].layerProps,
            filter: ["==", ["get", "render_type"], "point"],
            layout: {
              visibility: componentFeatureCollection ? "visible" : "none",
            },
          }}
        />
      </Source>
    </>
  );
};

export default ComponentsSourcesAndLayers;
