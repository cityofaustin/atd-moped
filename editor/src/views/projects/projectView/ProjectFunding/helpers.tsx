import { Dispatch, SetStateAction, useMemo } from "react";
import { Divider, Stack, IconButton } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridRowId,
  GridRowModesModel,
} from "@mui/x-data-grid-pro";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import DollarAmountIntegerField from "src/views/projects/projectView/ProjectFunding/DollarAmountIntegerField";
import EcaprisOverridableCell from "src/views/projects/projectView/ProjectFunding/EcaprisOverridableCell";
import SecondaryInformationChip from "src/components/SecondaryInformationChip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import {
  currencyFormatter,
  isAmountOutOfRange,
  outOfRangeErrorMessage,
} from "src/utils/numberFormatters";
import IconButtonWithTooltip from "src/components/IconButtonWithTooltip";
import AttachedFile from "src/components/AttachedFile";
import {
  DETACH_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  DETACH_FILE_MOPED_FUNDING_ATTACHMENT,
} from "src/queries/project";
import {
  GetCombinedProjectFundingQuery,
  GetFundingLookupsQuery,
} from "src/gql/graphql";
import { HandleSnackbar } from "src/components/useFeedbackSnackbar";

export type FundingRowsFromQuery =
  GetCombinedProjectFundingQuery["combined_project_funding_view"];

export type FundingRowFromQuery = FundingRowsFromQuery[number];

/** Workaround for DB view id calculation being possibly null; source columns are not-nullable
 * but Hasura codegen types id as: string | null. So, we need to override here to only be string type.
 */
export type SavedFundingRow = Omit<FundingRowFromQuery, "id" | "__typename"> & {
  id: string;
  isNew: false;
};

type DraftFundingRow = {
  id: string;
  proj_funding_id: string; // UUID before save
  moped_fund_source: null;
  moped_fund_program: null;
  moped_fund_status: null;
  fdu: null;
  unit_long_name: null;
  ecapris_funding_id: null;
  funding_amount: null;
  funding_description: null;
  is_manual: true;
  isNew: true;
};

export type FundingRowForGrid = SavedFundingRow | DraftFundingRow;

type FDUOption = GetFundingLookupsQuery["ecapris_subproject_funding"][number];

/** Transforms database funding records to DataGrid rows with objects to populate autocomplete components
 * @param fundingRecords - array of funding records from the database
 * @return transformed funding records for data grid
 */
export const transformDatabaseToGrid = (
  fundingRecords: FundingRowsFromQuery
): FundingRowForGrid[] => {
  return fundingRecords.map((record) => {
    const { id, __typename, ...rest } = record;

    return {
      ...rest,
      id: id ?? "",
      isNew: false,
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
  const funding_amount = gridRecord.funding_amount
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
    moped_funding_files,
    ecapris_funding,
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
    setFieldValue: (newValue: FDUOption) => newValue.unit_long_name,
  },
  {
    fieldName: "moped_fund_source",
    setFieldValue: (newValue: FDUOption) => newValue.moped_fund_source,
  },
  {
    fieldName: "moped_fund_program",
    setFieldValue: (newValue: FDUOption) => newValue.moped_fund_program,
  },
  {
    fieldName: "funding_amount",
    setFieldValue: (newValue: FDUOption) => newValue.amount,
  },
];

export const isCellEditable = (params: GridCellParams) => {
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

// creates object needed in the file attachement mutation
export const createFundingFileConnectionData = (
  fundingRecord: FundingRowForGrid,
  projectId: number
) => {
  if (fundingRecord.isNew) return; // Can't attach files to draft records

  const entityId = fundingRecord?.proj_funding_id;
  const isSyncedFromECapris = fundingRecord?.is_synced_from_ecapris ?? false;
  const addFileConnection = isSyncedFromECapris
    ? {
        files_ecapris_fundings: {
          data: {
            project_id: projectId,
            entity_id: entityId,
          },
        },
      }
    : {
        files_project_fundings: {
          data: {
            entity_id: entityId,
          },
        },
      };
  return {
    addFileConnection,
    entityId,
    ...(isSyncedFromECapris && { project_id: projectId }),
  };
};

type UseColumnsProps = {
  dataLookups: GetFundingLookupsQuery | undefined;
  rowModesModel: GridRowModesModel;
  handleDeleteOpen: (id: GridRowId) => () => void;
  handleSaveClick: (id: GridRowId) => () => void;
  handleCancelClick: (id: GridRowId) => () => void;
  handleEditClick: (id: GridRowId) => () => void;
  handleFileAttachmentClick: (id: number) => () => void;
  setOverrideFundingRecord: Dispatch<SetStateAction<FundingRowForGrid | null>>;
  usingShiftKey: boolean;
  logUserEvent: (event: string) => void;
  refetch: () => void;
  handleSnackbar: HandleSnackbar;
  shouldSyncEcaprisFunding: boolean;
  projectECaprisSubprojectId: string | null;
};

/** Hook that provides memoized column settings */
export const useColumns = ({
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
  handleSnackbar,
  refetch,
  shouldSyncEcaprisFunding,
  projectECaprisSubprojectId,
}: UseColumnsProps): GridColDef<FundingRowForGrid>[] =>
  useMemo((): GridColDef<FundingRowForGrid>[] => {
    return [
      {
        headerName: "FDU",
        field: "fdu",
        width: 140,
        editable: true,
        renderCell: ({ row, value }) => {
          if (row.isNew) return;

          return row.is_synced_from_ecapris ? (
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                alignItems: "flex-start",
              }}
            >
              <span>{value.fdu}</span>
              <SecondaryInformationChip chipLabel="eCAPRIS" />
            </Stack>
          ) : (
            value.fdu
          );
        },
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"ecapris_funding"}
            options={dataLookups?.ecapris_subproject_funding}
            fullWidthPopper={true}
            autocompleteProps={{
              ...fduAutocompleteProps,
              value: props.row.fdu,
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
            nextColumnField="moped_fund_source"
          />
        ),
      },
      {
        headerName: "Source",
        field: "moped_fund_source",
        width: 180,
        editable: true,
        valueFormatter: (value: FundingRowFromQuery["moped_fund_source"]) =>
          value?.funding_source_name,
        renderCell: ({ row, value }) => {
          if (row.isNew) return;

          return (
            <EcaprisOverridableCell
              row={row}
              ecaprisValue={row.ecapris_funding?.funding_source_id}
              currentValue={row.moped_fund_source?.funding_source_id}
              displayValue={value?.funding_source_name}
            />
          );
        },
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_source"}
            options={dataLookups?.moped_fund_sources ?? []}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Program",
        field: "moped_fund_program",
        width: 180,
        editable: true,
        renderCell: ({ row, value }) => {
          if (row.isNew) return;

          return (
            <EcaprisOverridableCell
              row={row}
              ecaprisValue={row.ecapris_funding?.funding_program_id}
              currentValue={row.moped_fund_program?.funding_program_id}
              displayValue={value?.funding_program_name}
            />
          );
        },
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_program"}
            options={dataLookups?.moped_fund_programs ?? []}
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
        field: "moped_fund_status",
        editable: true,
        width: 100,
        valueFormatter: (value: FundingRowFromQuery["moped_fund_status"]) =>
          value?.funding_status_name,
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_status"}
            defaultValue={1}
            options={dataLookups?.moped_fund_status ?? []}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Amount",
        field: "funding_amount",
        width: 100,
        editable: true,
        renderCell: ({ row, value }) => {
          if (row.isNew) return;

          return (
            <EcaprisOverridableCell
              row={row}
              ecaprisValue={row.ecapris_funding?.app}
              currentValue={row.funding_amount}
              displayValue={
                value === null ? null : currencyFormatter.format(value)
              }
            />
          );
        },
        preProcessEditCellProps: (params) => {
          return {
            ...params.props,
            error: isAmountOutOfRange(params.props.value),
            errorMessage: outOfRangeErrorMessage,
          };
        },
        valueFormatter: (value) =>
          value === null ? null : currencyFormatter.format(value),
        renderEditCell: (props) => <DollarAmountIntegerField {...props} />,
      },
      {
        headerName: "Files",
        field: "file_url",
        minWidth: 175,
        flex: 1,
        editable: false,
        sortable: false,
        renderCell: ({ row }) => {
          if (row.isNew) return;

          const filesType = row.is_synced_from_ecapris
            ? "ecapris_funding_files"
            : "moped_funding_files";
          if (!row?.[filesType]) {
            return;
          }
          return (
            <Stack
              direction="column"
              spacing={0.5}
              divider={<Divider sx={{ my: 0.5 }} />}
            >
              {row?.[filesType].map((file_record) => {
                const file = file_record.moped_project_file;
                if (!file) return null;
                return (
                  <AttachedFile
                    key={file.project_file_id}
                    fileRecordId={file_record.id}
                    file={file}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                    detachFileMutation={
                      row.is_synced_from_ecapris
                        ? DETACH_FILE_ECAPRIS_FUNDING_ATTACHMENT
                        : DETACH_FILE_MOPED_FUNDING_ATTACHMENT
                    }
                    confirmationFileType="funding"
                  />
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
        renderCell: ({ id, row }) => {
          if (row.isNew) return;

          const doesFDUBelongToCurrentSubproject =
            row.ecapris_subproject_id === projectECaprisSubprojectId;
          const wouldDeletingRowRestoreSyncedRow =
            !row.is_synced_from_ecapris && doesFDUBelongToCurrentSubproject;
          const deleteTooltipMessage =
            wouldDeletingRowRestoreSyncedRow && shouldSyncEcaprisFunding
              ? "Removing this row will restore the synced eCAPRIS FDU"
              : row.is_synced_from_ecapris
                ? "Switch off eCAPRIS sync to remove synced rows"
                : null;

          return row.is_manual ? (
            <DataGridActions
              id={id}
              rowModesModel={rowModesModel}
              handleCancelClick={handleCancelClick}
              handleDeleteOpen={handleDeleteOpen}
              handleSaveClick={handleSaveClick}
              handleEditClick={handleEditClick}
              handleFileAttachmentClick={handleFileAttachmentClick}
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
              <IconButtonWithTooltip
                title={deleteTooltipMessage}
                aria-label="delete"
                iconButtonProps={{ sx: { color: "inherit", padding: "5px" } }}
                disabled={!!row.is_synced_from_ecapris}
                onClick={handleDeleteOpen(id)}
              >
                <DeleteOutlinedIcon />
              </IconButtonWithTooltip>
            </>
          );
        },
      },
    ];
  }, [
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
    refetch,
    handleSnackbar,
    shouldSyncEcaprisFunding,
    projectECaprisSubprojectId,
  ]);
