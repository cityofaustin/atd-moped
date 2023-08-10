import { useState } from "react";

/**
 * Hook that provides state about whether map is loaded yet. Extends react-map-gl's onLoad prop
 * @param {Object} onLoadCallback - Callback function to run when map loads
 * @returns {Object}
 * @property {Boolean} hasMapLoaded - indicating if map has loaded
 * @property {Function} onMapLoad - callback for react-map-gl onLoaded prop
 */
export const useHasMapLoaded = (onLoadCallback = null) => {
  const [hasMapLoaded, setHasMapLoaded] = useState(false);

  const onMapLoad = () => {
    setHasMapLoaded(true);
    onLoadCallback && onLoadCallback();
  };

  return { hasMapLoaded, onMapLoad };
};
