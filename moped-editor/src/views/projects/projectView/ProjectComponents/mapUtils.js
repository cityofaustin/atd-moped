// There is a config here that sets the order of layers on the map
// The hook makes sure this is enforced
// Config also sets whether a layer is interactive or not

// inputs:
// 1. basemapKey: aerial or streets
// 2. data (to see what sources and layers need to be added)

// outputs
// 1. basemap source and layer if aerial
// 2. sources and layers in correct order
// 3. array of interactive layers based on config and what layers are present in the data
const useMapLayers = ({ basemapKey, data }) => {
  // Handle basemaps

  // Handle sources and layer for data
  return {
    interactiveLayerIds,
    BaseMapComponents,
    ProjectComponentsSourcesAndLayers,
  };
};
