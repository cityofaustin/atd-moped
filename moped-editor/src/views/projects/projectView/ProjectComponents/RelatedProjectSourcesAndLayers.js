import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";
import { useFeatureTypes } from "./utils/map";

/**
 * Component that renders feature collection of related project component features
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Boolean} isCreatingComponent - are we creating a component?
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {Object} featureCollection - GeoJSON feature collection with all project features
 * @param {Boolean} shouldShowRelatedProjects - should we show related projects
 * @returns JSX.Element
 */
const RelatedProjectSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  featureCollection,
  shouldShowRelatedProjects,
  linesId,
  pointsId,
}) => {
  const projectLines = useFeatureTypes(featureCollection, "line");
  const projectPoints = useFeatureTypes(featureCollection, "point");

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
      <Source id={linesId} type="geojson" data={projectLines} promoteId="id">
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES[linesId].layerProps,
            layout: {
              ...MAP_STYLES[linesId].layerProps.layout,
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

      <Source id={pointsId} type="geojson" data={projectPoints} promoteId="id">
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES[pointsId].layerProps,
            layout: {
              ...MAP_STYLES[pointsId].layerProps.layout,
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

export default RelatedProjectSourcesAndLayers;
