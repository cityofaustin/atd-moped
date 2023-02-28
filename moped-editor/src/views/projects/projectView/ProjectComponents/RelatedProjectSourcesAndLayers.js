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
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @returns JSX.Element
 */
const RelatedProjectSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  featureCollection,
  shouldShowRelatedProjects,
  clickedComponent,
}) => {
  const projectLines = useFeatureTypes(featureCollection, "line");
  const projectPoints = useFeatureTypes(featureCollection, "point");

  const isCreatingOrEditing = isCreatingComponent || isEditingComponent;
  const shouldShowNonMutedFeatures =
    shouldShowRelatedProjects && !clickedComponent && !isCreatingOrEditing;
  const shouldShowMutedFeatures =
    (shouldShowRelatedProjects && !!clickedComponent) ||
    (shouldShowRelatedProjects && isCreatingOrEditing);

  return (
    <>
      <Source
        id="related-project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["related-project-lines"].layerProps,
            layout: {
              ...MAP_STYLES["related-project-lines"].layerProps.layout,
              visibility: shouldShowNonMutedFeatures ? "visible" : "none",
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
          // Override the id set in the config above so we have distinct muted layers
          id="related-lines-muted"
        />
      </Source>

      <Source
        id="related-project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...MAP_STYLES["related-project-points"].layerProps,
            layout: {
              ...MAP_STYLES["related-project-points"].layerProps.layout,
              visibility: shouldShowNonMutedFeatures ? "visible" : "none",
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
          // Override the id set in layerProps config above so we have distinct muted layers
          id="related-points-muted"
        />
      </Source>
    </>
  );
};

export default RelatedProjectSourcesAndLayers;
