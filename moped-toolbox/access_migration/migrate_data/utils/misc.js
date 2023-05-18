/**
 * @param {object} row - original record from interm db
 * @param {object[]} fields - array of field mappings with each mapping having an
 * "in" and "out" prop with an optional tranform func
 * @returns {object} a new row with mapped values
 */
const mapRow = (row, fields) =>
  fields.reduce((newRow, field) => {
    if (field.transform) {
      newRow[field.out] = field.transform(row);
    } else {
      newRow[field.out] = row[field.in];
    }
    return newRow;
  }, {});

/**
 * Like maprow, but allows for transform to manipulate entire output row -
 * modifying the new row in place and returning it
 * @param {object} row - original record from interm db
 * @param {object[]} fields - array of field mappings with each mapping having an
 * "in" and "out" prop with an optional tranform func
 * @returns {object} a new row with mapped values
 */
const mapRowExpanded = (row, fields) =>
  fields.reduce((newRow, field) => {
    if (field.transform) {
      field.transform(row, newRow);
    } else {
      newRow[field.out] = row[field.in];
    }
    return newRow
  }, {});

const chunkArray = (arr, chunkSize = 50) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

module.exports = {
  chunkArray,
  mapRow,
  mapRowExpanded
};
