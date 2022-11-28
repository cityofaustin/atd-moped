import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

/**
 * Component that renders the feature collection of a draft component while creating a component
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} draftComponentFeatures - GeoJSON feature collection of the draft component
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @returns JSX.Element
 */
const DraftComponentSourcesAndLayers = ({
  draftComponentFeatures,
  linkMode,
}) => {
  return (
    <>
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
    </>
  );
};

export default DraftComponentSourcesAndLayers;
