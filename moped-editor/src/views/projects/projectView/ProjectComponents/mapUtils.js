// There is a config here that sets the order of layers on the map
// The hook makes sure this is enforced
// Config also sets whether a layer is interactive or not

// inputs:
// 1. basemapKey: aerial or streets
// 2. data (to see what sources and layers need to be added)
// 3. isEditingComponent

// outputs
// 1. basemap source and layer if aerial
// 2. sources and layers in correct order
// 3. array of interactive layers based on config and what layers are present in the data
export const useMapLayers = ({
  basemapKey,
  data,
  isEditingComponent,
  linkMode,
  draftLayerId,
}) => {
  // Handle basemaps
  // Address https://github.com/cityofaustin/atd-moped/pull/837#pullrequestreview-1146234061
  //   {basemapKey === "aerial" && (
  //     <>
  //       <Source {...basemaps[basemapKey].sources.aerials} />
  //       <Layer {...basemaps[basemapKey].layers.aerials} />
  //       {/* show street labels on top of other layers */}
  //       <Layer {...basemaps[basemapKey].layers.streetLabels} />
  //     </>
  //   )}
  console.log({ basemapKey, data, isEditingComponent });

  const interactiveLayerIds = isEditingComponent
    ? linkMode === "lines"
      ? ["ctn-lines-underlay", "project-lines-underlay", draftLayerId]
      : ["ctn-points-underlay", "project-points", draftLayerId]
    : ["project-points", "project-lines-underlay"];

  const BaseMapComponents = null;
  const ProjectComponentsSourcesAndLayers = null;

  // Handle sources and layer for data
  return {
    interactiveLayerIds,
    BaseMapComponents,
    ProjectComponentsSourcesAndLayers,
  };
};
