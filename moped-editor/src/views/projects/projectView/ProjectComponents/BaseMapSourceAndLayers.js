import { Source, Layer } from "react-map-gl";
import { basemaps } from "./mapSettings";
import theme from "src/theme/index";

/**
 * Component that renders Mapbox source and layers needed for the aerial basemap
 * @param {string} basemapKey
 * @returns JSX.Element
 */
const BaseMapSourceAndLayers = ({ basemapKey }) => {
  return (
    <>
      <Source {...basemaps.aerial.sources.aerials} />
      <Layer
        {...basemaps.aerial.layers.aerials}
        layout={{ visibility: basemapKey === "aerial" ? "visible" : "none" }}
      />
      {/* Always show street labels so they can be the "target" of beforeId 
      and always appear on top of everything else */}
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
                  "text-color": theme.palette.map.white,
                  "text-halo-color": theme.palette.map.black,
                  "text-halo-width": 1,
                }
              : {
                  "text-color": theme.palette.map.black,
                },
        }}
      />
    </>
  );
};

export default BaseMapSourceAndLayers;
