import { Source, Layer } from "react-map-gl";
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
const ComponentSourcesAndLayers = ({
  data,
  isCreatingComponent,
  isEditingComponent,
  linkMode,
  clickedComponent,
  isDrawing,
}) => {
  // This is a temporary to get data into the map sources
  const { projectLines, projectPoints } = data;

  const isViewingComponents =
    !isCreatingComponent && !clickedComponent && !isEditingComponent;

  const isEditingLines =
    (isCreatingComponent || isEditingComponent) &&
    linkMode === "lines" &&
    !isDrawing;

  const shouldShowMutedFeatures =
    clickedComponent || isCreatingComponent || isEditingComponent;

  return (
    <>
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
    </>
  );
};

export default ComponentSourcesAndLayers;
