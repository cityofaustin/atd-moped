/**
 * Attempts to retrieve a valid graphql search value, for example when searching on an
 * integer/float field but providing it a string, this function returns the value configured
 * in the invalidValueDefault field in the search object, or null.
 * @param {Object} query - The GraphQL query configuration
 * @param {string} column - The name of the column to search
 * @param {*} value - The value in question
 * @returns {*} - The value output
 */
export const getSearchValue = (queryConfig, column, value) => {
  // Retrieve the type of field (string, float, int, etc)
  const type = queryConfig.columns[column].type.toLowerCase();
  // Get the invalidValueDefault in the search config object
  const invalidValueDefault =
    queryConfig.columns[column].search?.invalidValueDefault ?? null;
  // If the type is number of float, attempt to parse as such
  if (["number", "float", "double"].includes(type)) {
    value = Number.parseFloat(value) || invalidValueDefault;
  }
  // If integer, attempt to parse as integer
  if (["int", "integer"].includes(type)) {
    value = Number.parseInt(value) || invalidValueDefault;
  }
  // If string, remove unrecognized graphQL characters (double-quotes or backslash)
  if (typeof value === "string") {
    value = value.replace(/"|\\/g, "");
  }
  // Any other value types are pass-through for now
  return value;
};
