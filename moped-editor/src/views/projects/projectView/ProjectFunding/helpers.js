import React, { useMemo } from "react";
import { Divider, Typography, Stack, IconButton } from "@mui/material";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import DollarAmountIntegerField from "src/views/projects/projectView/ProjectFunding/DollarAmountIntegerField";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import { currencyFormatter } from "src/utils/numberFormatters";

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

  // the database expects the funding amount to be an Int or null. An empty string will result in an error, coerce to null
  const funding_amount = Boolean(gridRecord.funding_amount)
    ? gridRecord.funding_amount
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
    proj_funding_id,
    isNew,
    is_manual,
    ecapris_funding_files,
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
    funding_amount,
  };
};

// object to pass to the Fund column's LookupAutocomplete component
const fduAutocompleteProps = {
  getOptionLabel: (option) =>
    option.fdu ? `${option.fdu} - ${option.unit_long_name}` : "",
  isOptionEqualToValue: (value, option) =>
    value?.ecapris_funding_id === option?.ecapris_funding_id,
};

const fduAutocompleteDependentFields = [
  {
    fieldName: "unit_long_name",
    setFieldValue: (newValue) => newValue?.unit_long_name,
  },
  {
    fieldName: "fund_source",
    setFieldValue: (newValue) => newValue?.moped_fund_source,
  },
  {
    fieldName: "fund_program",
    setFieldValue: (newValue) => newValue?.moped_fund_program,
  },
  {
    fieldName: "funding_amount",
    setFieldValue: (newValue) => newValue?.amount,
  },
];

export const isCellEditable = (params) => {
  if (params.row.is_synced_from_ecapris) {
    return false;
  } else {
    // if record is not synced from ecapris, but is also not manual, it means its been overriden
    // dont edit using data grid
    if (!params.row.is_manual) {
      return false;
    }
    // records that are not synced from ecapris and are manual are editable
    return true;
  }
};

/** Hook that provides memoized column settings */
export const useColumns = ({
  dataProjectFunding,
  dataLookups,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  handleFileAttachmentClick,
  setOverrideFundingRecord,
  usingShiftKey,
  logUserEvent,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "FDU",
        field: "fdu",
        width: 180,
        editable: true,
        renderCell: ({ row, value }) =>
          row.is_synced_from_ecapris ? (
            <>
              <span>{value?.fdu}</span>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                SYNCED FROM ECAPRIS
              </Typography>
            </>
          ) : (
            value?.fdu
          ),
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"ecapris_funding"}
            options={dataLookups?.ecapris_subproject_funding}
            fullWidthPopper={true}
            autocompleteProps={{
              ...fduAutocompleteProps,
              value: props?.row?.fdu,
            }}
            dependentFieldsArray={fduAutocompleteDependentFields}
          />
        ),
      },
      {
        headerName: "Unit Name",
        field: "unit_long_name",
        editable: true, // this is to be able to use the renderEditCell option to update the related phase
        // during editing -- the input field is always disabled
        width: 175,
        renderEditCell: (props) => (
          <ViewOnlyTextField
            {...props}
            value={props.row.unit_long_name}
            usingShiftKey={usingShiftKey}
            previousColumnField="fdu"
            nextColumnField="amount"
          />
        ),
      },
      {
        headerName: "Source",
        field: "fund_source",
        width: 180,
        editable: true,
        valueFormatter: (value) => value?.funding_source_name,
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_source"}
            options={dataProjectFunding?.moped_fund_sources ?? []}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Program",
        field: "fund_program",
        width: 180,
        editable: true,
        valueFormatter: (value) => value?.funding_program_name,
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_program"}
            options={dataProjectFunding?.moped_fund_programs ?? []}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Description",
        field: "funding_description",
        width: 200,
        editable: true,
        renderEditCell: (props) => <DataGridTextField {...props} multiline />,
      },
      {
        headerName: "Status",
        field: "fund_status",
        editable: true,
        width: 100,
        valueFormatter: (value) => value?.funding_status_name,
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_status"}
            defaultValue={1}
            options={dataProjectFunding?.moped_fund_status ?? []}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Amount",
        field: "funding_amount",
        width: 100,
        editable: true,
        valueFormatter: (value) =>
          value === null ? null : currencyFormatter.format(value),
        renderEditCell: (props) => <DollarAmountIntegerField {...props} />,
        type: "currency",
      },
      {
        headerName: "Files",
        field: "file_url",
        minWidth: 150,
        flex: 1,
        editable: false,
        sortable: false,
        renderCell: ({ row }) => {
          const filesType = row.is_synced_from_ecapris
            ? "ecapris_funding_files"
            : "moped_funding_files";
          return (
            <Stack direction="column" spacing={0.5}>
              {row?.[filesType].map((file_record, index) => {
                const file = file_record.moped_project_file;

                if (!file) return null;

                return (
                  <React.Fragment key={file.project_file_id}>
                    {index > 0 && <Divider sx={{ my: 0.5 }} />}
                    <ProjectFileLink
                      fileKey={file.file_key}
                      fileUrl={file.file_url}
                      fileName={file.file_name}
                      condensed
                      showNetworkPathStyles={false}
                    />
                  </React.Fragment>
                );
              })}
            </Stack>
          );
        },
      },
      {
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
        width: 110,
        type: "actions",
        renderCell: ({ id, row }) =>
          row.is_manual ? (
            <DataGridActions
              id={id}
              rowModesModel={rowModesModel}
              handleCancelClick={handleCancelClick}
              handleDeleteOpen={handleDeleteOpen}
              handleSaveClick={handleSaveClick}
              handleEditClick={handleEditClick}
              editDisabled={row.is_synced_from_ecapris}
              deleteDisabled={row.is_synced_from_ecapris}
            />
          ) : (
            <>
              <IconButton
                aria-label="edit"
                sx={{ color: "inherit", padding: "5px" }}
                onClick={() => {
                  logUserEvent("funding_ecapris_override_form_load");
                  setOverrideFundingRecord(row);
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="attachment"
                sx={{ color: "inherit", padding: "5px" }}
                onClick={handleFileAttachmentClick(id)}
              >
                <AttachFileOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                sx={{ color: "inherit", padding: "5px" }}
                disabled={!!row.is_synced_from_ecapris}
                onClick={handleDeleteOpen(id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </>
          ),
      },
    ];
  }, [
    dataProjectFunding,
    dataLookups,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleFileAttachmentClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
  ]);
