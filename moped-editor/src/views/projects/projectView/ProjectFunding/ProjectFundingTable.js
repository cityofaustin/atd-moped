import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash.isequal";

// Material
import {
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  DataGridPro,
  GridRowModes,
  GridRowEditStopReasons,
  useGridApiRef,
  gridColumnFieldsSelector,
} from "@mui/x-data-grid-pro";
import { v4 as uuidv4 } from "uuid";
import { currencyFormatter } from "src/utils/numberFormatters";

import {
  COMBINED_FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
  ECAPRIS_FDU_OPTIONS_QUERY,
} from "src/queries/funding";
import { PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC } from "src/queries/project";

import DollarAmountIntegerField from "src/views/projects/projectView/ProjectFunding/DollarAmountIntegerField";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import SubprojectFundingModal from "src/views/projects/projectView/ProjectFunding/SubprojectFundingModal";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import { handleRowEditStop } from "src/utils/dataGridHelpers";
import OverrideFundingDialog from "src/views/projects/projectView/ProjectFunding/OverrideFundingDialog";
import {
  transformDatabaseToGrid,
  transformGridToDatabase,
} from "src/views/projects/projectView/ProjectFunding/helpers";
import { useLogUserEvent } from "src/utils/userEvents";

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
  dataFduOptions,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  setOverrideFundingRecord,
  usingShiftKey,
  logUserEvent,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "FDU",
        field: "fdu",
        width: 200,
        editable: true,
        renderCell: ({ row, value }) =>
          row.is_synced_from_ecapris ? (
            <>
              <span>{value?.fdu}</span>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
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
            options={dataFduOptions?.ecapris_subproject_funding}
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
        width: 200,
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
        width: 200,
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
        width: 200,
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
        valueFormatter: (value) => currencyFormatter.format(value),
        renderEditCell: (props) => <DollarAmountIntegerField {...props} />,
        type: "currency",
      },
      {
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
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
    dataFduOptions,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
  ]);

const ProjectFundingTable = ({
  projectId,
  handleSnackbar,
  refetchProjectSummary,
  eCaprisSubprojectId = null,
  shouldSyncEcaprisFunding,
}) => {
  const apiRef = useGridApiRef();

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

  const { loading: loadingFduOptions, data: dataFduOptions } = useQuery(
    ECAPRIS_FDU_OPTIONS_QUERY,
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

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Prevent save on click-away (rowFocusOut) so that clicking "Add Manually" or other
  // controls does not save the current row and create inconsistent state.
  const handleFundingRowEditStop = useCallback(
    (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
        return;
      }
      handleRowEditStop(rows, setRows)(params, event);
    },
    [rows]
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
    dataFduOptions,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
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

  // Disable "Add Manually" button when any row is in edit mode to prevent
  // creating multiple unsaved rows which leads to inconsistent state
  const isEditMode = Object.values(rowModesModel).some(
    (m) => m?.mode === GridRowModes.Edit
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        loading={
          loadingProjectFunding || loadingFduOptions || !dataProjectFunding
        }
        apiRef={apiRef}
        ref={apiRef}
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStop={handleFundingRowEditStop}
        isCellEditable={isCellEditable}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        onCellKeyDown={handleTabKeyDown}
        onCellDoubleClick={doubleClickListener}
        localeText={{ noRowsLabel: "No funding sources" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
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
              <Grid
                container
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid item xs={6} md={4}>
                  <ProjectSummaryProjectECapris
                    projectId={projectId}
                    eCaprisSubprojectId={eCaprisSubprojectId}
                    refetch={refetchFundingData}
                    handleSnackbar={handleSnackbar}
                    noWrapper
                  />
                </Grid>
                <Grid item container xs={2} justifyContent={"flex-end"}>
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
                </Grid>
              </Grid>
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
    </div>
  );
};

export default ProjectFundingTable;
