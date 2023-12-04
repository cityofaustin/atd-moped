import { Source, Layer } from "react-map-gl";
import { SOURCES } from "./mapSettings";
import { MAP_STYLES } from "./mapStyleSettings";

/**
 * Component that renders CTN GeoJSON data to be captured into draft or edited components
 * All layers are set to show below basemap street labels using beforeId = "components-placeholder"
 * @param {Boolean} isCreatingComponent - are we creating a component?
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @param {Boolean} isDrawing - is the user currently drawing?
 * @param {Object} ctnLinesGeojson - GeoJSON data for CTN lines in the visible area of the map
 * @param {Object} ctnPointsGeojson - GeoJSON data for CTN points in the visible area of the map
 * @returns JSX.Element
 */
const CTNSourcesAndLayers = ({
  isCreatingComponent,
  isEditingComponent,
  linkMode,
  isDrawing,
  ctnLinesGeojson,
  ctnPointsGeojson,
}) => {
  const isEditingLines =
    (isCreatingComponent || isEditingComponent) &&
    linkMode === "lines" &&
    !isDrawing;
  const isEditingPoints =
    (isCreatingComponent || isEditingComponent) &&
    linkMode === "points" &&
    !isDrawing;

  return (
    <>
      <Source
        id="ATD_ADMIN.CTN"
        type="geojson"
        data={ctnLinesGeojson}
        promoteId={SOURCES["ATD_ADMIN.CTN"]._featureIdProp}
      >
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["ctn-lines-underlay"].layerProps,
            layout: {
              ...MAP_STYLES["ctn-lines-underlay"].layerProps.layout,
              visibility: isEditingLines ? "visible" : "none",
            },
          }}
        />

        <Layer
          beforeId="components-placeholder"
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
        id="ATD_ADMIN.CTN_Intersections"
        type="geojson"
        data={ctnPointsGeojson}
        promoteId={SOURCES["ATD_ADMIN.CTN_Intersections"]._featureIdProp}
      >
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["ctn-points-underlay"].layerProps,
            layout: {
              visibility: isEditingPoints ? "visible" : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["ctn-points"].layerProps,
            layout: {
              visibility: isEditingPoints ? "visible" : "none",
            },
          }}
        />
      </Source>
    </>
  );
};

export default CTNSourcesAndLayers;
