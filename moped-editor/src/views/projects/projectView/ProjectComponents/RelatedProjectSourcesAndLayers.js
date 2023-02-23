import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";
import { useFeatureTypes } from "./utils/map";

/**
 * Component that renders feature collection of related project component features
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} featureCollection - GeoJSON feature collection with all project features
 * @param {Boolean} shouldShowRelatedProjects - should we show related projects
 * @param {String} linesId - id of layer to render lines also used to determine styles to apply
 * * @param {String} pointsId - id of layer to render points also used to determine styles to apply
 * @returns JSX.Element
 */
const RelatedProjectSourcesAndLayers = ({
  featureCollection,
  shouldShowRelatedProjects,
  linesId,
  pointsId,
}) => {
  const projectLines = useFeatureTypes(featureCollection, "line");
  const projectPoints = useFeatureTypes(featureCollection, "point");

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
      </Source>
    </>
  );
};

export default RelatedProjectSourcesAndLayers;
