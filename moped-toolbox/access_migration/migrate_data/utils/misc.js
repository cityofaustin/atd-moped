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
    return newRow;
  }, {});

const chunkArray = (arr, chunkSize = 50) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const createProjectActivityRecords = ({
  project_id,
  added_by,
  date_added,
  project_name,
  john_user_id,
}) => {
  return [
    {
      record_id: project_id,
      record_type: "moped_project",
      record_project_id: project_id,
      operation_type: "INSERT",
      updated_by_user_id: added_by,
      created_at: date_added,
      record_data: {
        event: {
          op: "INSERT",
          data: {
            new: {
              added_by,
              date_added,
              project_id,
              project_name,
            },
            old: null,
          },
        },
      },
      description: [],
    },
    {
      record_id: project_id,
      record_type: "moped_project_migration",
      record_project_id: project_id,
      operation_type: "UPDATE",
      updated_by_user_id: john_user_id,
      description: [{ newSchema: true }],
      record_data: {
        event: {
          op: "UPDATE",
          data: {
            new: {},
            old: null,
          },
        },
      },
    },
  ];
};

const createProjectUpdateActivityRecords = ({
  project_id,
  john_user_id,
}) => {
  return [
    {
      record_id: project_id,
      record_type: "moped_project_update_migration",
      record_project_id: project_id,
      operation_type: "UPDATE",
      updated_by_user_id: john_user_id,
      description: [{ newSchema: true }],
      record_data: {
        event: {
          op: "UPDATE",
          data: {
            new: {},
            old: null,
          },
        },
      },
    },
  ];
};

module.exports = {
  chunkArray,
  mapRow,
  mapRowExpanded,
  createProjectActivityRecords,
  createProjectUpdateActivityRecords,
};
