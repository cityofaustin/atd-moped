const mapRow = (row, fields) =>
  fields.reduce((newRow, field) => {
    if (field.transform) {
      newRow[field.out] = field.transform(row);
    } else {
      newRow[field.out] = row[field.in];
    }
    return newRow;
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
};
