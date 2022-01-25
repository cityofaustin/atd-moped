import { useState, useEffect } from "react";

/**
 * Filter k/v pairs from an object by the key names passed in an array
 * @param {object} obj - The object with unwanted k/v pairs
 * @param {array} keys - Keys of unwanted k/v pairs
 * @return {object} New object without unneeded k/v pairs
 */
export const filterObjectByKeys = (obj, keys) =>
  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: obj[key],
      }),
      {}
    );

/**
 * Prevents the line from being saved on enter key
 * @param {object} e - Event Object
 */
export const handleKeyEvent = e => {
  if (e.key === "Enter" || e.key === " ") {
    e.stopPropagation();
  }
};

/**
 * Hook to get current window size
 * Listens for resize and returns { width, height }
 */
export const useWindowResize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const listener = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return {
    width,
    height,
  };
};
