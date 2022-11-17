import { Source, Layer } from "react-map-gl";
import { SOURCES } from "./mapSettings";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

/**
 * Component that renders all sources and layers for project components
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} data - GeoJSON data for all project components
 * @param {Boolean} isCreatingComponent - are we editing a component?
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @param {Object} componentFeatureCollection - GeoJSON data for the component clicked
 * @returns JSX.Element
 */
const ComponentsSourcesAndLayers = ({
  data,
  isCreatingComponent,
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

  const isViewingComponents = !isCreatingComponent && !clickedComponent;

  const isEditingLines =
    isCreatingComponent && linkMode === "lines" && !isDrawing;
  const isEditingPoints =
    isCreatingComponent && linkMode === "points" && !isDrawing;

  const shouldShowMutedFeatures = clickedComponent || isCreatingComponent;

  const isClickedComponentLineRepresentation =
    clickedComponent?.moped_components?.line_representation;

  return (
    <>
      <Source
        id="ATD_ADMIN.CTN"
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
              visibility: isEditingLines ? "visible" : "none",
            },
          }}
        />

        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["ctn-lines"].layerProps,
            layout: {
              ...mapStyles["ctn-lines"].layerProps.layout,
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
            ...mapStyles["project-lines-underlay"].layerProps,
            layout: {
              ...mapStyles["project-lines-underlay"].layerProps.layout,
              visibility: isEditingLines ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["project-lines"].layerProps,
            layout: {
              ...mapStyles["project-lines"].layerProps.layout,
              visibility: isViewingComponents ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["project-lines-muted"].layerProps,
            layout: {
              ...mapStyles["project-lines-muted"].layerProps.layout,
              visibility: shouldShowMutedFeatures ? "visible" : "none",
            },
          }}
        />
      </Source>

      <Source
        id="ATD_ADMIN.CTN_Intersections"
        type="geojson"
        data={ctnPointsGeojson}
        promoteId={SOURCES["ctn-points"]._featureIdProp}
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["ctn-points-underlay"].layerProps,
            layout: {
              visibility: isEditingPoints ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["ctn-points"].layerProps,
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
            ...mapStyles["project-points"].layerProps,
            layout: {
              ...mapStyles["project-points"].layerProps.layout,
              visibility: isViewingComponents ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["project-points-muted"].layerProps,
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
                isClickedComponentLineRepresentation
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
                !isClickedComponentLineRepresentation
                  ? "visible"
                  : "none",
            },
          }}
        />
      </Source>
    </>
  );
};

export default ComponentsSourcesAndLayers;
