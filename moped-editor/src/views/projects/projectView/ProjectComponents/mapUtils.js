// There is a config here that sets the order of layers on the map
// The hook makes sure this is enforced

// inputs:
// 1. basemapKey: aerial or streets
// 2. data (to see what sources and layers need to be added)

// outputs
// 1. basemap source and layer if aerial
// 2. sources and layers in correct order
const useMapLayers = () => {
  return true;
};
