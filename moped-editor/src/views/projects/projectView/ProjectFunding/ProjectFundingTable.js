import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash/isEqual";

// Material
import { Button, CircularProgress, Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  DataGridPro,
  GridRowModes,
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

import DollarAmountIntegerField from "src/views/projects/projectView/ProjectFunding/DollarAmountIntegerField";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import SubprojectFundingModal from "src/views/projects/projectView/ProjectFunding/SubprojectFundingModal";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ButtonDropdownMenu from "src/components/ButtonDropdownMenu";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import { handleRowEditStop } from "src/utils/dataGridHelpers";

// Pass this object as `sx` to the toolbar slotProps.
const toolbarSx = {
  fundingButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
  toolbarTitle: (theme) => ({
    marginBottom: theme.spacing(1),
  }),
};

// object to pass to the Fund column's LookupAutocomplete component
const fduAutocompleteProps = {
  getOptionLabel: (option) =>
    option.fdu ? `${option.fdu} - ${option.unit_long_name}` : "",
  isOptionEqualToValue: (value, option) =>
    value?.ecapris_funding_id === option?.ecapris_funding_id,
};

/** Transforms database funding records to DataGrid rows with lookup objects to populate autocomplete components
 * @param {Array} fundingRecords - array of funding records from the database
 * @param {Object} lookupData - object containing lookup arrays from the database
 * @return {Array} - array of transformed funding records for data grid
 */
const transformDatabaseToGrid = (fundingRecords, lookupData) => {
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

    // Remove fields unneeded in the data grid row
    const {
      funding_source_id,
      funding_status_id,
      funding_program_id,
      ...tableRecord
    } = record;

    // Return new record with lookup objects for autocomplete components
    return {
      ...tableRecord,
      fund_source,
      fund_program,
      fund_status,
    };
  });
};

/** Transforms DataGrid row to database funding record format for mutations
 * @param {Object} gridRecord - DataGrid row object
 * @return {Object} - transformed funding record for database mutation
 */
const transformGridToDatabase = (gridRecord) => {
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

/** Hook that provides memoized column settings */
const useColumns = ({
  dataProjectFunding,
  dataFduOptions,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  usingShiftKey,
}) =>
  useMemo(() => {
    return [
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
            options={dataProjectFunding["moped_fund_sources"]}
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
            options={dataProjectFunding["moped_fund_programs"]}
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
            options={dataProjectFunding["moped_fund_status"]}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "FDU",
        field: "fdu",
        width: 200,
        editable: true,
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"ecapris_funding"}
            options={dataFduOptions?.ecapris_subproject_funding}
            fullWidthPopper={true}
            autocompleteProps={{
              ...fduAutocompleteProps,
              value: props?.row?.ecapris_subproject_funding,
            }}
          />
        ),
      },
      {
        headerName: "Unit Long Name",
        field: "unit_long_name",
        editable: true, // this is to be able to use the renderEditCell option to update the related phase
        // during editing -- the input field is always disabled
        width: 150,
        renderEditCell: (props) => (
          <ViewOnlyTextField
            {...props}
            value={props.row.moped_proj_funding?.unit_long_name}
            usingShiftKey={usingShiftKey}
            previousColumnField="funding_description"
            nextColumnField="date_estimate"
            valueIdName="related_phase_id"
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
        renderCell: ({ id, row }) => (
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
    usingShiftKey,
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
            _or: [
              { ecapris_subproject_id: { _eq: eCaprisSubprojectId } },
              { project_id: { _eq: Number(projectId) } },
            ],
          },
        }
      : {
          projectFundingConditions: {
            project_id: { _eq: Number(projectId) },
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  useEffect(() => {
    if (tableFundingRows && tableFundingRows.length > 0) {
      setRows(tableFundingRows);
    }
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
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "fund_source" },
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
    const editedRow = rows.find((row) => row.proj_funding_id === id);
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
    usingShiftKey,
  });

  if (loadingProjectFunding || !dataProjectFunding) return <CircularProgress />;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
        ref={apiRef}
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop(rows, setRows)}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        onCellKeyDown={handleTabKeyDown}
        localeText={{ noRowsLabel: "No funding sources" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Funding sources",
            primaryActionButton: !!eCaprisSubprojectId ? (
              <ButtonDropdownMenu
                buttonWrapperStyle={toolbarSx.fundingButton}
                addAction={handleAddRecordClick}
                openActionDialog={setIsDialogOpen}
                parentButtonText="Add Funding Source"
                firstOptionText="New funding source"
                secondOptionText="From eCapris"
              />
            ) : (
              <Button
                sx={toolbarSx.fundingButton}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={handleAddRecordClick}
              >
                Add Funding Source
              </Button>
            ),
            children: (
              <Grid>
                <Grid item xs={3}>
                  <ProjectSummaryProjectECapris
                    projectId={projectId}
                    eCaprisSubprojectId={eCaprisSubprojectId}
                    refetch={refetchFundingData}
                    handleSnackbar={handleSnackbar}
                    noWrapper
                  />
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
    </div>
  );
};

export default ProjectFundingTable;
