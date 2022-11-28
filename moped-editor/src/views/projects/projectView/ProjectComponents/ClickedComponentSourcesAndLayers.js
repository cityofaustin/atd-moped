import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

/**
 * Component that renders GeoJSON data for the clicked component
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} clickedComponent - Details of the component that was clicked
 * @param {Object} componentFeatureCollection - GeoJSON data for the component clicked
 * @param {Boolean} isEditingComponent - are we editing a component?
 * @returns JSX.Element
 */
const ClickedComponentSourcesAndLayers = ({
  clickedComponent,
  componentFeatureCollection,
  isEditingComponent,
}) => {
  const isClickedComponentLineRepresentation =
    clickedComponent?.moped_components?.line_representation;

  return (
    <>
      <Source
        id="clicked-component-features"
        type="geojson"
        data={componentFeatureCollection}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["clicked-component-features-lines"].layerProps,
            layout: {
              ...mapStyles["clicked-component-features-lines"].layerProps
                .layout,
              visibility:
                componentFeatureCollection &&
                isClickedComponentLineRepresentation &&
                !isEditingComponent
                  ? "visible"
                  : "none",
            },
          }}
        />
        <Layer
          beforeId="street-labels"
          {...{
            ...mapStyles["clicked-component-features-points"].layerProps,
            layout: {
              visibility:
                componentFeatureCollection &&
                !isClickedComponentLineRepresentation &&
                !isEditingComponent
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
