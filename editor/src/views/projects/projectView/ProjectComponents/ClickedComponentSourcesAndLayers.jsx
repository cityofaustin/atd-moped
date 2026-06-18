import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";

/**
 * Component that rendersa feature collection of features for the clicked component
 * All layers are set to show below basemap street labels using beforeId = "components-placeholder"
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @param {Object} componentFeatureCollection - GeoJSON feature collection of the component clicked
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @param {Boolean} isClickedComponentRelated - are we highlighting a related component?
 * @returns JSX.Element
 */
const ClickedComponentSourcesAndLayers = ({
  clickedComponent,
  componentFeatureCollection,
  isEditingComponent,
  isClickedComponentRelated,
}) => {
  const isClickedComponentLineRepresentation =
    clickedComponent?.moped_components?.line_representation;
  const shouldHighlightLineComponent =
    componentFeatureCollection &&
    isClickedComponentLineRepresentation &&
    !isEditingComponent;
  const shouldHighlightPointComponent =
    componentFeatureCollection &&
    !isClickedComponentLineRepresentation &&
    !isEditingComponent;

  return (
    <>
      <Source
        id="clicked-component-features"
        type="geojson"
        data={componentFeatureCollection}
        promoteId="id"
      >
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["clicked-component-features-lines"].layerProps,
            layout: {
              ...MAP_STYLES["clicked-component-features-lines"].layerProps
                .layout,
              visibility:
                shouldHighlightLineComponent && !isClickedComponentRelated
                  ? "visible"
                  : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["clicked-related-features-lines"].layerProps,
            layout: {
              ...MAP_STYLES["clicked-related-features-lines"].layerProps.layout,
              visibility:
                shouldHighlightLineComponent && isClickedComponentRelated
                  ? "visible"
                  : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["clicked-component-features-points"].layerProps,
            layout: {
              visibility:
                shouldHighlightPointComponent && !isClickedComponentRelated
                  ? "visible"
                  : "none",
            },
          }}
        />
        <Layer
          beforeId="components-placeholder"
          {...{
            ...MAP_STYLES["clicked-related-features-points"].layerProps,
            layout: {
              visibility:
                shouldHighlightPointComponent && isClickedComponentRelated
                  ? "visible"
                  : "none",
            },
          }}
        />
      </Source>
    </>
  );
};

export default ClickedComponentSourcesAndLayers;
