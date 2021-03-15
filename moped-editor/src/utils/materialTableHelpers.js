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
