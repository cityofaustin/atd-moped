import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

/**
 * Component that renders all sources and layers for project components
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Boolean} isCreatingComponent - are we creating a component?
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @param {Boolean} isDrawing - is the user currently drawing?
 * @param {Object} projectLines - GeoJSON feature collection with all project lines
 * @param {Object} projectPoints - GeoJSON feature collection with all project points
 * @returns JSX.Element
 */
const ProjectSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  linkMode,
  clickedComponent,
  isDrawing,
  projectLines,
  projectPoints,
}) => {
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

export default ProjectSourcesAndLayers;
