import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";
import { useFeatureTypes } from "./utils/map";

/**
 * Component that renders feature collection of parent project component features
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Boolean} isCreatingComponent - are we creating a component?
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {Object} parentProjectComponentsFeatureCollection - GeoJSON feature collection with all project features
 * @param {Boolean} shouldShowRelatedProjects - should we show related projects
 * @returns JSX.Element
 */
const ParentProjectSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  parentProjectComponentsFeatureCollection,
  shouldShowRelatedProjects,
}) => {
  const projectLines = useFeatureTypes(
    parentProjectComponentsFeatureCollection,
    "line"
  );
  const projectPoints = useFeatureTypes(
    parentProjectComponentsFeatureCollection,
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
        id="parent-project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["parent-project-lines"].layerProps,
            layout: {
              ...MAP_STYLES["parent-project-lines"].layerProps.layout,
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
        id="parent-project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["parent-project-points"].layerProps,
            layout: {
              ...MAP_STYLES["parent-project-points"].layerProps.layout,
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

export default ParentProjectSourcesAndLayers;
