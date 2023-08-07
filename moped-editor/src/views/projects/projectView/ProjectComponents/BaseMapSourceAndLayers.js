import { Source, Layer } from "react-map-gl";
import { basemaps } from "./mapSettings";
import { COLORS } from "./mapStyleSettings";

/**
 * Component that renders Mapbox source and layers needed for the aerial basemap
 * @param {string} basemapKey
 * @returns JSX.Element
 */
const BaseMapSourceAndLayers = ({ basemapKey }) => {
  return (
    <>
      {/* This source and layer provide the aerial Nearmap basemap. It renders below the 
      component placeholder to make sure component features are always visible when present.
      The beforeId attribute is set to keep the street labels on top. */}
      <Source {...basemaps.aerial.sources.aerials} />
      <Layer
        {...basemaps.aerial.layers.aerials}
        layout={{ visibility: basemapKey === "aerial" ? "visible" : "none" }}
        beforeId="street-labels"
      />

      {/* This source and empty layer provide a placeholder for component layers
      to render before using the layer attribute called beforeId. */}
      <Source
        id="placeholder-source"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: [],
        }}
      />
      <Layer
        id="components-placeholder"
        type="circle"
        source="placeholder-source"
      />

      {/* This layer provides the street labels with toggleable styling to be more
      readable when the aerial layer is selected. It's render order in this component
      allows it to remain at the very top of the map at all times. */}
      <Layer
        {...{
          ...basemaps.aerial.layers.streetLabels,
          layout: {
            ...basemaps.aerial.layers.streetLabels.layout,
          },
          // Update street label text color to be readable on either basemap type
          paint:
            basemapKey === "aerial"
              ? {
                  "text-color": COLORS.white,
                  "text-halo-color": COLORS.black,
                  "text-halo-width": 1,
                }
              : {
                  "text-color": COLORS.black,
                },
        }}
      />
    </>
  );
};

export default BaseMapSourceAndLayers;
