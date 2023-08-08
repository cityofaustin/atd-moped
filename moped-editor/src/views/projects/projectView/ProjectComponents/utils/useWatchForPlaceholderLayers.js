import { useState } from "react";

/**
 * Hook to check map refs to see if placeholder layers that other layers target with beforeId prop
 * have loaded. This is needed to prevent errors when the placeholder layers are not yet loaded.
 * @param {Object} mapRef - React ref to mapbox map instance
 * @returns {Object}
 * @property {Boolean} hasPlaceHolderLayers - indicating if placeholder layers have loaded
 * @property {Function} checkIfMapHasPlaceHolderLayers - callback for react-map-gl onLoaded prop
 * to check if placeholder layers have loaded
 */
export const useHavePlaceholderLayersLoaded = (mapRef) => {
  const [hasPlaceHolderLayers, setHasPlaceHolderLayers] = useState(false);

  const checkIfMapHasPlaceHolderLayers = () => {
    const hasPlaceholderLayers = Boolean(
      mapRef?.current?.getLayer("components-placeholder")
    );

    setHasPlaceHolderLayers(hasPlaceholderLayers);
  };

  return { hasPlaceHolderLayers, checkIfMapHasPlaceHolderLayers };
};
