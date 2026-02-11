/** Transforms database funding records to DataGrid rows with lookup objects to populate autocomplete components
 * @param {Array} fundingRecords - array of funding records from the database
 * @param {Object} lookupData - object containing lookup arrays from the database
 * @return {Array} - array of transformed funding records for data grid
 */
export const transformDatabaseToGrid = (fundingRecords, lookupData) => {
  const {
    moped_fund_sources,
    moped_fund_programs,
    moped_fund_status: moped_fund_statuses,
  } = lookupData;

  return fundingRecords.map((record) => {
    // Reconstruct lookup objects for editing in autocomplete components
    const fund_source = record.funding_source_id
      ? moped_fund_sources.find(
          (s) => s.funding_source_id === record.funding_source_id
        )
      : null;

    const fund_program = record.funding_program_id
      ? moped_fund_programs.find(
          (p) => p.funding_program_id === record.funding_program_id
        )
      : null;

    const fund_status = record.funding_status_id
      ? moped_fund_statuses.find(
          (s) => s.funding_status_id === record.funding_status_id
        )
      : null;

    const fduOption = record.fdu
      ? {
          fdu: record.fdu,
          ecapris_funding_id: record.ecapris_funding_id,
          unit_long_name: record.unit_long_name,
        }
      : null;

    // Remove fields unneeded in the data grid row
    const {
      funding_source_id,
      funding_status_id,
      funding_program_id,
      fdu,
      ecapris_funding_id,
      ...tableRecord
    } = record;

    // Return new record with lookup objects for autocomplete components
    return {
      ...tableRecord,
      fund_source,
      fund_program,
      fund_status,
      fdu: fduOption,
    };
  });
};

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

  const ecapris_subproject_id = gridRecord.fdu
    ? gridRecord.fdu.ecapris_subproject_id
    : null;

  const fdu_record_amount = gridRecord.fdu ? gridRecord.fdu.amount : null;
  // if the amount on the fdu matches what we are saving, its not an override
  const should_use_ecapris_amount =
    fdu_record_amount === Number(gridRecord.funding_amount);

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
    ecapris_subproject_id,
    should_use_ecapris_amount,
  };
};
