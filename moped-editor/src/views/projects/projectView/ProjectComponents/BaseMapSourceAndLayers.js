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
      {/* This layer provides the street labels with toggleable styling to be more
      readable when the aerial layer is selected. This renders first so that the 
      component placeholder can target it with the beforeId layer attribute. */}
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

      {/* This empty source and layer provide a placeholder for component layers
      to render beneath it by targeting it with beforeId and another placeholder 
      for the aerial layer below to target. These render next so the aerial basemap
      can target it with the the beforeId layer attribute.  */}
      <Source
        id="placeholder-source"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: [],
        }}
      >
        <Layer
          id="components-placeholder"
          type="circle"
          source="placeholder-source"
          beforeId="street-labels"
        />
        <Layer
          id="aerial-placeholder"
          type="circle"
          source="placeholder-source"
          beforeId="components-placeholder"
        />
      </Source>

      {/* This source and layer provide the aerial Nearmap basemap. The beforeId 
      attribute is set to keep the street labels and component layers on top. */}
      <Source {...basemaps.aerial.sources.aerials} />
      <Layer
        {...basemaps.aerial.layers.aerials}
        layout={{ visibility: basemapKey === "aerial" ? "visible" : "none" }}
        beforeId="aerial-placeholder"
      />
    </>
  );
};

export default BaseMapSourceAndLayers;
