/** Transforms DataGrid row to database funding record format for mutations
 * @param {Object} gridRecord - DataGrid row object
 * @return {Object} - transformed funding record for database mutation
 */
export const transformGridToDatabase = (gridRecord) => {
  // Extract the lookup ids from the selected lookup objects
  const funding_source_id = gridRecord.fund_source
    ? gridRecord.fund_source.funding_source_id
    : null;
  const funding_program_id = gridRecord.fund_program
    ? gridRecord.fund_program.funding_program_id
    : null;
  const funding_status_id = gridRecord.fund_status
    ? gridRecord.fund_status.funding_status_id
    : null;
  const fdu = gridRecord.fdu ? gridRecord.fdu.fdu : null;
  const unit_long_name = gridRecord.fdu ? gridRecord.fdu.unit_long_name : null;
  const ecapris_funding_id = gridRecord.fdu
    ? gridRecord.fdu.ecapris_funding_id
    : null;

  const {
    id,
    __typename,
    is_synced_from_ecapris,
    status_name,
    program_name,
    source_name,
    fund_program,
    fund_source,
    fund_status,
    ecapris_subproject_id,
    proj_funding_id,
    isNew,
    is_manual,
    ...databaseFields
  } = gridRecord;

  // Return the database fields along with the extracted lookup ids
  return {
    ...databaseFields,
    funding_source_id,
    funding_program_id,
    // If no new funding status is selected, the default should be used
    funding_status_id: funding_status_id ? funding_status_id : 1,
    fdu,
    unit_long_name,
    ecapris_funding_id,
  };
};
