import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash.isequal";

// Material
import {
  Button,
  FormControlLabel,
  Grid2,
  Link,
  Switch,
  Tooltip,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import {
  GridRowModes,
  useGridApiRef,
  gridColumnFieldsSelector,
} from "@mui/x-data-grid-pro";
import MopedDataGridInlineEdit from "src/components/DataGridPro/MopedDataGridInlineEdit";
import ExternalLink from "src/components/ExternalLink";
import { v4 as uuidv4 } from "uuid";
import { currencyFormatter } from "src/utils/numberFormatters";
import downloadFileAttachment from "src/utils/downloadFileAttachment";
import {
  cleanUpFileKey,
  clickableTextStyles,
} from "src/views/projects/projectView/ProjectFiles/ProjectFiles";
import { isValidUrl } from "src/utils/urls";
import { useUser } from "src/auth/user";

import {
  COMBINED_FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
  GET_FUNDING_LOOKUPS,
} from "src/queries/funding";
import {
  CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC,
} from "src/queries/project";

import FileUploadDialogSingle from "src/components/FileUpload/FileUploadDialogSingle";
import DollarAmountIntegerField from "src/views/projects/projectView/ProjectFunding/DollarAmountIntegerField";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import SubprojectFundingModal from "src/views/projects/projectView/ProjectFunding/SubprojectFundingModal";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import {
  getIsEditMode,
  handleRowEditStop,
} from "src/components/DataGridPro/utils/helpers.js";
import OverrideFundingDialog from "src/views/projects/projectView/ProjectFunding/OverrideFundingDialog";
import {
  transformDatabaseToGrid,
  transformGridToDatabase,
} from "src/views/projects/projectView/ProjectFunding/helpers";
import { useLogUserEvent } from "src/utils/userEvents";

// TODO: Open dialog to view attachments on click of attachment icon in actions column
// TODO: Update files_ecapris_funding table to use id instead of fao_id for ecapris funding reference
// TODO: Fetch funding attachments id and render way to detach in dialog if there is an attachment
// TODO: Detach in dialog
// TODO: Rename existing file mutations so they don't include "attachments" in name (example: PROJECT_FILE_ATTACHMENTS)
// TODO: Handle if file is deleted - need to detach too. Detach in delete handler in ProjectFiles
// TODO: Handle if file override - need to have attachment copy to new record. Leave old association in case override is reverted.
// TODO: Show both moped_proj_files and ecapris funding files in Files table
// TODO: Add copy icon to network path files

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

/** Hook that provides memoized column settings */
const useColumns = ({
  dataProjectFunding,
  dataLookups,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  handleAttachmentClick,
  setOverrideFundingRecord,
  usingShiftKey,
  logUserEvent,
  getCognitoSession,
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
        renderCell: ({ row }) => {
          return (
            <Stack direction="column" spacing={0.5}>
              {row.ecapris_funding_files.map((file_record) => {
                const file = file_record.moped_project_file;

                if (!file) return null;
                if (file.file_key) {
                  return (
                    <Link
                      onClick={() =>
                        downloadFileAttachment(
                          file?.file_key,
                          getCognitoSession
                        )
                      }
                      sx={clickableTextStyles}
                    >
                      {cleanUpFileKey(file?.file_key)}
                    </Link>
                  );
                }
                return isValidUrl(file?.file_url) ? (
                  <ExternalLink
                    linkProps={{
                      sx: clickableTextStyles,
                    }}
                    url={file?.file_url}
                    // text={file?.file_url}
                  />
                ) : (
                  // if the user provided file_url is not a valid url, just render the text
                  <Typography
                    sx={{
                      backgroundColor: "#eee",
                      fontFamily: "monospace",
                      display: "block",
                      wordWrap: "break-word",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {file?.file_url}
                  </Typography>
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
              handleAttachmentClick={handleAttachmentClick}
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
                onClick={handleAttachmentClick(id)}
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
    handleAttachmentClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
    getCognitoSession,
  ]);

const ProjectFundingTable = ({
  projectId,
  handleSnackbar,
  refetchProjectSummary,
  eCaprisSubprojectId = null,
  shouldSyncEcaprisFunding,
}) => {
  const apiRef = useGridApiRef();
  const { getCognitoSession } = useUser();

  /* Query Moped and eCAPRIS funding with matching filters */
  const queryVariables =
    eCaprisSubprojectId && shouldSyncEcaprisFunding
      ? {
          projectFundingConditions: {
            project_id: { _eq: Number(projectId) },
          },
        }
      : {
          projectFundingConditions: {
            _and: [
              { project_id: { _eq: Number(projectId) } },
              { is_synced_from_ecapris: { _eq: false } },
            ],
          },
        };

  const {
    loading: loadingProjectFunding,
    data: dataProjectFunding,
    refetch,
  } = useQuery(COMBINED_FUNDING_QUERY, {
    variables: { ...queryVariables },
    fetchPolicy: "no-cache",
  });
  // TODO: Fix id used in this component for eCAPRIS to be ecapris_subproject_funding id and not fao_id to fix relationship
  console.log("dataProjectFunding", dataProjectFunding);

  const tableFundingRows = useMemo(() => {
    const fundingRows = dataProjectFunding?.combined_project_funding_view;

    if (!fundingRows || fundingRows.length === 0) return [];

    const fundingRowsWithRelatedLookups = transformDatabaseToGrid(
      fundingRows,
      dataProjectFunding
    );
    return fundingRowsWithRelatedLookups;
  }, [dataProjectFunding]);

  const fdusArray = useMemo(() => {
    return tableFundingRows.map((row) => row.fdu) || [];
  }, [tableFundingRows]);

  const { loading: loadingLookups, data: dataLookups } = useQuery(
    GET_FUNDING_LOOKUPS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);
  const [updateShouldSyncECapris] = useMutation(
    PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC
  );
  const logUserEvent = useLogUserEvent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [overrideFundingRecord, setOverrideFundingRecord] = useState(null);
  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [usingShiftKey, setUsingShiftKey] = useState(false);
  const isEditMode = getIsEditMode(rowModesModel);

  const handleSubprojectDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  // Open funding override modal when double clicking in a cell of a record from ecapris
  const doubleClickListener = (params) => {
    if (!params.row.is_manual) {
      logUserEvent("funding_ecapris_override_form_load");
      setOverrideFundingRecord(params.row);
    }
  };

  useEffect(() => {
    setRows(tableFundingRows);
  }, [tableFundingRows]);

  const handleTabKeyDown = React.useCallback(
    (params, event) => {
      if (params.cellMode === GridRowModes.Edit) {
        if (event.key === "Tab") {
          // Track whether the shift key is being used in combination with tab
          setUsingShiftKey(event.shiftKey);

          const columnFields = gridColumnFieldsSelector(apiRef).filter(
            (field) =>
              apiRef.current.isCellEditable(
                apiRef.current.getCellParams(params.id, field)
              )
          );

          // Always prevent going to the next element in the tab sequence because the focus is
          // handled manually to support edit components rendered inside Portals
          event.preventDefault();

          const index = columnFields.findIndex(
            (field) => field === params.field
          );
          const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(
            params.id
          );
          const nextFieldToFocus =
            columnFields[event.shiftKey ? index - 1 : index + 1];
          apiRef.current.setCellFocus(params.id, nextFieldToFocus);
          // if the column is not visible, bring it into view
          apiRef.current.scrollToIndexes({ rowIndex, colIndex: index + 1 });
        }
      }
    },
    [apiRef]
  );

  // adds a blank row to the table and updates the row modes model
  const handleAddRecordClick = () => {
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        fund_source: null,
        fund_program: null,
        fund_status: null,
        funding_description: null,
        fdu: null,
        unit_long_name: null,
        ecapris_funding_id: null,
        funding_amount: null,
        isNew: true,
        proj_funding_id: id,
        is_manual: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "fdu" },
    }));
  };

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  // handles row delete
  const handleDeleteClick = useCallback(
    (id) => () => {
      // remove row from rows in state
      setRows(rows.filter((row) => row.proj_funding_id !== id));

      const deletedRow = rows.find((row) => row.id === id);
      const { proj_funding_id } = deletedRow;

      // if the deleted row is in the db, delete from db
      if (!deletedRow.isNew) {
        deleteProjectFunding({
          variables: {
            proj_funding_id,
          },
        })
          .then(() => refetch())
          .then(() => {
            setIsDeleteConfirmationOpen(false);
            handleSnackbar(true, "Funding source deleted", "success");
          })
          .catch((error) => {
            handleSnackbar(
              true,
              "Error deleting funding source",
              "error",
              error
            );
          });
      }
    },
    [rows, deleteProjectFunding, refetch, handleSnackbar]
  );

  // when a user cancels editing by clicking the X in the actions
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  /* File attachment state and handlers */
  const [addFundingFileAttachment] = useMutation(
    CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT
  );
  const [fileAttachmentId, setFileAttachmentId] = useState(null);
  const [isFileAttachmentDialogOpen, setIsFileAttachmentDialogOpen] =
    useState(false);

  const handleAttachmentClick = useCallback(
    (id) => () => {
      setFileAttachmentId(id);
      setIsFileAttachmentDialogOpen(true);
    },
    []
  );

  /**
   * Persists the file data into the database
   * @param {Object} fileDataBundle - The file bundle as provided by the FileUpload component
   */
  const handleClickSaveFile = (fileDataBundle) => {
    const fundingRecord = rows.find((row) => row.id === fileAttachmentId);
    const entityId = fundingRecord?.proj_funding_id;

    addFundingFileAttachment({
      variables: {
        object: {
          project_id: projectId,
          file_name: fileDataBundle?.name,
          file_type: fileDataBundle?.type,
          file_description: fileDataBundle?.description,
          file_key: fileDataBundle?.key,
          file_size: fileDataBundle?.file?.fileSize ?? 0,
          file_url: fileDataBundle?.url,
          // nested insert into files_ecapris_funding
          files_ecapris_fundings: {
            data: {
              project_id: projectId,
              entity_id: entityId,
            },
          },
        },
      },
    })
      .then(() => {
        setIsFileAttachmentDialogOpen(false);
        handleSnackbar(true, "File attachment saved", "success");
      })
      .catch((error) => {
        handleSnackbar(true, "Error saving file attachment", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (updatedRow, originalRow) => {
    const mutationData = transformGridToDatabase(updatedRow);

    if (updatedRow.isNew) {
      return (
        addProjectFunding({
          variables: {
            objects: {
              ...mutationData,
              project_id: Number(projectId),
            },
          },
        })
          .then((response) => {
            // replace the temporary row id with the one proj funding id from the record creation
            const record_id =
              response.data.insert_moped_proj_funding.returning[0]
                .proj_funding_id;
            updatedRow.proj_funding_id = record_id;
          })
          .then(() => {
            refetch();
            handleSnackbar(true, "Funding source added", "success");
          })
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(true, "Error adding funding source", "error", error);
          })
      );
    } else {
      // Remove __typename and check if the row has changed
      delete originalRow.__typename;
      delete updatedRow.__typename;
      const hasRowChanged = !isEqual(updatedRow, originalRow);

      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      } else {
        return (
          updateProjectFunding({
            variables: {
              ...mutationData,
              proj_funding_id: updatedRow.proj_funding_id,
            },
          })
            .then(() => {
              refetch();
              handleSnackbar(true, "Funding source updated", "success");
            })
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => updatedRow)
            .catch((error) => {
              handleSnackbar(
                true,
                "Error updating funding source",
                "error",
                error
              );
            })
        );
      }
    }
  };

  const refetchFundingData = useCallback(() => {
    refetch();
    refetchProjectSummary();
  }, [refetch, refetchProjectSummary]);

  const dataGridColumns = useColumns({
    dataProjectFunding,
    dataLookups,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleAttachmentClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
    getCognitoSession,
  });

  const handleECaprisSwitch = () => {
    logUserEvent(
      `funding_ecapris_sync_toggle_${!shouldSyncEcaprisFunding === false ? "off" : "on"}`
    );
    updateShouldSyncECapris({
      variables: {
        projectId: projectId,
        shouldSync: !shouldSyncEcaprisFunding,
      },
    })
      .then(() => {
        handleSnackbar(true, "eCAPRIS sync status updated", "success");
        refetchFundingData();
      })
      .catch((error) =>
        handleSnackbar(
          true,
          "Error updating eCAPRIS sync status",
          "error",
          error
        )
      );
  };

  const isCellEditable = (params) => {
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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MopedDataGridInlineEdit
        loading={loadingProjectFunding || loadingLookups || !dataProjectFunding}
        apiRef={apiRef}
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.id}
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop(rows, setRows)}
        isCellEditable={isCellEditable}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}
        toolbar
        onCellKeyDown={handleTabKeyDown}
        onCellDoubleClick={doubleClickListener}
        localeText={{ noRowsLabel: "No funding sources" }}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Funding sources",
            primaryActionButton: (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRecordClick}
                startIcon={<AddCircleIcon />}
                disabled={isEditMode}
              >
                {"Add Manually"}
              </Button>
            ),
            secondaryActionButton: (
              <Button
                variant="outlined"
                onClick={() => {
                  logUserEvent("funding_ecapris_import_click");
                  setIsDialogOpen(true);
                }}
                startIcon={<AddCircleIcon />}
                disabled={!eCaprisSubprojectId || isEditMode}
              >
                {"Import from eCAPRIS"}
              </Button>
            ),
            documentationLink:
              "https://atd-dts.gitbook.io/moped-documentation/user-guides/add-funding-to-a-project",
            children: (
              <Grid2
                container
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid2
                  size={{
                    xs: 6,
                    md: 4,
                  }}
                >
                  <ProjectSummaryProjectECapris
                    projectId={projectId}
                    eCaprisSubprojectId={eCaprisSubprojectId}
                    loading={loadingProjectFunding}
                    options={
                      dataProjectFunding?.ecapris_subproject_funding ?? []
                    }
                    refetch={refetchProjectSummary}
                    handleSnackbar={handleSnackbar}
                    disabled={isEditMode}
                  />
                </Grid2>
                <Grid2
                  container
                  sx={{
                    justifyContent: "flex-end",
                  }}
                  size={2}
                >
                  <Tooltip
                    placement="bottom"
                    title={
                      !eCaprisSubprojectId
                        ? "Add eCAPRIS subproject ID to enable syncing"
                        : isEditMode
                          ? "Save or cancel current edits first"
                          : null
                    }
                  >
                    <FormControlLabel
                      label="Sync from eCAPRIS"
                      control={
                        <Switch
                          variant="standard"
                          color="primary"
                          disabled={!eCaprisSubprojectId || isEditMode}
                          checked={shouldSyncEcaprisFunding}
                          onChange={handleECaprisSwitch}
                        />
                      }
                    />
                  </Tooltip>
                </Grid2>
              </Grid2>
            ),
          },
        }}
      />
      <DeleteConfirmationModal
        type={"funding source"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
      {eCaprisSubprojectId && (
        <SubprojectFundingModal
          isDialogOpen={isDialogOpen}
          handleDialogClose={handleSubprojectDialogClose}
          eCaprisID={eCaprisSubprojectId}
          fdusArray={fdusArray}
          addProjectFunding={addProjectFunding}
          projectId={projectId}
          handleSnackbar={handleSnackbar}
          refetch={refetch}
        />
      )}
      {overrideFundingRecord && (
        <OverrideFundingDialog
          fundingRecord={overrideFundingRecord}
          projectId={projectId}
          refetchFundingQuery={refetch}
          setOverrideFundingRecord={setOverrideFundingRecord}
          onClose={() => setOverrideFundingRecord(null)}
          handleSnackbar={handleSnackbar}
          dataProjectFunding={dataProjectFunding}
        />
      )}
      {isFileAttachmentDialogOpen && (
        <FileUploadDialogSingle
          title={"Add file"}
          dialogOpen={isFileAttachmentDialogOpen}
          handleClickCloseUploadFile={() =>
            setIsFileAttachmentDialogOpen(false)
          }
          handleClickSaveFile={handleClickSaveFile}
          projectId={projectId}
          fileTypesLookup={dataLookups?.moped_file_types ?? []}
        />
      )}
    </div>
  );
};

export default ProjectFundingTable;
