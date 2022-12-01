import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

/**
 * Component that renders the feature collection of a draft component while creating a component
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} draftEditComponentFeatureCollection - GeoJSON feature collection of the draft component
 * @param {String} linkMode - Tracks if we are editing "lines" or "points"
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @returns JSX.Element
 */
const EditDraftComponentSourcesAndLayers = ({
  draftEditComponentFeatureCollection,
  linkMode,
  isEditingComponent,
}) => {
  return (
    <>
      <Source
        id="edit-draft-component-lines"
        type="geojson"
        data={draftEditComponentFeatureCollection}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["edit-draft-component-lines"].layerProps,
            layout: {
              ...mapStyles["clicked-component-features-lines"].layerProps
                .layout,
              visibility:
                linkMode === "lines" && isEditingComponent ? "visible" : "none",
            },
          }}
        />
      </Source>

      <Source
        id="edit-draft-component-points"
        type="geojson"
        data={draftEditComponentFeatureCollection}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...mapStyles["edit-draft-component-points"].layerProps}
          layout={{
            visibility:
              linkMode === "points" && isEditingComponent ? "visible" : "none",
          }}
        />
      </Source>
    </>
  );
};

export default EditDraftComponentSourcesAndLayers;
