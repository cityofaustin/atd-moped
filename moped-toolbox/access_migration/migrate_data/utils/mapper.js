const mapRow = (row, fields) =>
  fields.reduce((newRow, field) => {
    if (field.transform) {
      newRow[field.out] = field.transform(row);
    } else {
      newRow[field.out] = row[field.in];
    }
    return newRow;
  }, {});

module.exports = {
  mapRow,
};
