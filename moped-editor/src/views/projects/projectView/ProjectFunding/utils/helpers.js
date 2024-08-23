  /**
   * Get lookup value for a given table using a record ID and returning a name
   * @param {string} lookupTable - Name of lookup table as found within the GQL data query object
   * @param {string} attribute - Prefix version of attribute name relying on the pattern of _id and _name
   * @param {number} id - ID used to find target record in lookup table
   * @return {string} - Name of attribute in the given row.
   */
  export const getLookupValueByID = (lookupTable, attribute, id) => {
    if (!id) return null;
    console.log(lookupTable)

    return lookupTable.find((item) => item[`${attribute}_id`] === id)[
      `${attribute}_name`
    ];
  };