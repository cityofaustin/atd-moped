import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";
import { useFeatureTypes } from "./utils/map";

/**
 * Component that renders feature collection of existing component features in a project
 * All layers are set to show below basemap street labels using beforeId = "components-placeholder"
 * @param {Boolean} isCreatingComponent - are we creating a component?
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @param {Boolean} isDrawing - is the user currently drawing?
 * @param {Object} projectComponentsFeatureCollection - GeoJSON feature collection with all project features
 * @returns JSX.Element
 */
const ProjectSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  linkMode,
  clickedComponent,
  isDrawing,
  projectComponentsFeatureCollection,
  draftEditComponent,
}) => {
  // If we are editing, we don't show the feature being edited
  const draftEditComponentId = draftEditComponent?.project_component_id;

  const projectFeaturesWithoutComponentBeingEdited = draftEditComponent
    ? {
        ...projectComponentsFeatureCollection,
        features: projectComponentsFeatureCollection.features.filter(
          (feature) => feature.component_id !== draftEditComponentId
        ),
      }
    : projectComponentsFeatureCollection;

  const projectLines = useFeatureTypes(
    projectFeaturesWithoutComponentBeingEdited,
    "line"
  );
  const projectPoints = useFeatureTypes(
    projectFeaturesWithoutComponentBeingEdited,
    "point"
  );

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
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["project-lines-underlay"].layerProps,
            layout: {
              ...MAP_STYLES["project-lines-underlay"].layerProps.layout,
              visibility: isEditingLines ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["project-lines"].layerProps,
            layout: {
              ...MAP_STYLES["project-lines"].layerProps.layout,
              visibility: isViewingComponents ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
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
        id="project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["project-points"].layerProps,
            layout: {
              ...MAP_STYLES["project-points"].layerProps.layout,
              visibility: isViewingComponents ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["project-points-muted"].layerProps,
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
