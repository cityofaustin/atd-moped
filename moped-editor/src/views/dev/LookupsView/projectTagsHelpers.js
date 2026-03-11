/**
 * Transform helpers for Project Tags DataGrid - following the pattern from
 * ProjectFundingTable (transformDatabaseToGrid / transformGridToDatabase).
 * Prepares data for an abstracted DataGridPro that could take these functions.
 */

/** Transforms database project tag records to DataGrid row format
 * @param {Array} records - array of moped_tags from the database
 * @return {Array} - array of row objects for DataGrid
 */
export const transformDatabaseToGrid = (records) => {
  if (!records) return [];
  return records.map((record) => ({
    id: record.id,
    name: record.name,
    type: record.type,
    slug: record.slug,
    full_name: record.full_name,
    is_deleted: record.is_deleted,
  }));
};

/** Transforms DataGrid row to database format for mutations
 * @param {Object} gridRow - DataGrid row object
 * @return {Object} - object for insert/update mutation
 */
export const transformGridToDatabase = (gridRow) => {
  const { id, __typename, full_name, isNew, ...rest } = gridRow;
  return rest;
};
