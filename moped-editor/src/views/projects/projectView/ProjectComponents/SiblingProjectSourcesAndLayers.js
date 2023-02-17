import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";
import { useFeatureTypes } from "./utils/map";

/**
 * Component that renders feature collection of sibling project component features
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Boolean} isCreatingComponent - are we creating a component?
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {Object} siblingProjectComponentsFeatureCollection - GeoJSON feature collection with all project features
 * @param {Boolean} shouldShowRelatedProjects - should we show related projects
 * @returns JSX.Element
 */
const SiblingProjectSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  siblingProjectComponentsFeatureCollection,
  shouldShowRelatedProjects,
}) => {
  const projectLines = useFeatureTypes(
    siblingProjectComponentsFeatureCollection,
    "line"
  );
  const projectPoints = useFeatureTypes(
    siblingProjectComponentsFeatureCollection,
    "point"
  );

  //   const isViewingComponents =
  //     !isCreatingComponent && !clickedComponent && !isEditingComponent;

  //   const isEditingLines =
  //     (isCreatingComponent || isEditingComponent) &&
  //     linkMode === "lines" &&
  //     !isDrawing;

  //   const shouldShowMutedFeatures =
  //     clickedComponent || isCreatingComponent || isEditingComponent;

  return (
    <>
      <Source
        id="sibling-project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["sibling-project-lines"].layerProps,
            layout: {
              ...MAP_STYLES["sibling-project-lines"].layerProps.layout,
              visibility: shouldShowRelatedProjects ? "visible" : "none",
            },
          }}
        />
        {/* <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["project-lines-muted"].layerProps,
            layout: {
              ...MAP_STYLES["project-lines-muted"].layerProps.layout,
              visibility: shouldShowMutedFeatures ? "visible" : "none",
            },
          }}
        /> */}
      </Source>

      <Source
        id="sibling-project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["sibling-project-points"].layerProps,
            layout: {
              ...MAP_STYLES["sibling-project-points"].layerProps.layout,
              visibility: shouldShowRelatedProjects ? "visible" : "none",
            },
          }}
        />
        {/* <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["project-points-muted"].layerProps,
            layout: {
              visibility: shouldShowMutedFeatures ? "visible" : "none",
            },
          }}
        /> */}
      </Source>
    </>
  );
};

export default SiblingProjectSourcesAndLayers;
