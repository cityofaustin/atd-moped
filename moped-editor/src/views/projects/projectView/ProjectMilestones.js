import React, { useState, useEffect, useMemo, useCallback } from "react";
import isEqual from "lodash.isequal";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@mui/material";
import { DataGridPro, GridRowModes, useGridApiRef } from "@mui/x-data-grid-pro";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";

import {
  UPDATE_PROJECT_MILESTONES_MUTATION,
  DELETE_PROJECT_MILESTONE,
  ADD_PROJECT_MILESTONE,
} from "../../../queries/project";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";

import { usePhaseNameLookup } from "./ProjectPhase/helpers";
import ToggleEditComponent from "./ToggleEditComponent";
import MilestoneTemplateModal from "./ProjectMilestones/MilestoneTemplateModal";
import DataGridDateFieldEdit from "./ProjectMilestones/DataGridDateFieldEdit";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import { handleRowEditStop } from "src/utils/dataGridHelpers";

const useMilestoneNameLookup = (data) =>
  useMemo(() => {
    if (!data) {
      return {};
    }
    return data.moped_milestones.reduce(
      (obj, item) =>
        Object.assign(obj, {
          [item.milestone_id]: item.milestone_name,
        }),
      {}
    );
  }, [data]);

const requiredFields = ["moped_milestone"];

const useColumns = ({
  data,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  handleDeleteOpen,
  usingShiftKey,
  phaseNameLookup,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Milestone",
        field: "moped_milestone",
        valueFormatter: (value) => value?.milestone_name,
        sortComparator: (v1, v2) =>
          v1.milestone_name.localeCompare(v2.milestone_name),
        // input validation:
        preProcessEditCellProps: (params) => ({
          ...params.props,
          error: !params.props.value?.milestone_id,
        }),
        editable: true,
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"milestone"}
            options={data?.moped_milestones}
            textFieldProps={{
              helperText: props.error ? "Milestone is required" : "",
              error: props.error,
            }}
            dependentFieldName="moped_milestone_related_phase"
            setDependentFieldValue={(newValue) => ({
              related_phase_id: newValue?.related_phase_id,
            })}
          />
        ),
        width: 250,
      },
      {
        headerName: "Description",
        field: "description",
        width: 200,
        editable: true,
        renderEditCell: (props) => <DataGridTextField {...props} multiline />,
      },
      {
        headerName: "Related phase",
        field: "moped_milestone_related_phase",
        editable: true, // this is to be able to use the renderEditCell option to update the related phase
        // during editing -- the input field is always disabled
        valueGetter: (value, row) =>
          phaseNameLookup[row.moped_milestone?.related_phase_id] ?? "",
        width: 150,
        renderEditCell: (props) => (
          <ViewOnlyTextField
            {...props}
            value={props.row.moped_milestone}
            lookupTable={phaseNameLookup}
            usingShiftKey={usingShiftKey}
            previousColumnField="description"
            nextColumnField="date_estimate"
            valueIdName="related_phase_id"
          />
        ),
      },
      {
        headerName: "Completion estimate",
        field: "date_estimate",
        editable: true,
        valueFormatter: (value) =>
          value ? format(parseISO(value), "MM/dd/yyyy") : null,
        renderEditCell: (props) => (
          <DataGridDateFieldEdit
            {...props}
            name="date_estimate"
            label="Completion estimate"
          />
        ),
        width: 180,
      },
      {
        headerName: "Date completed",
        field: "date_actual",
        editable: true,
        valueFormatter: (value) =>
          value ? format(parseISO(value), "MM/dd/yyyy") : null,
        renderEditCell: (props) => (
          <DataGridDateFieldEdit
            {...props}
            name="date_actual"
            label="Date (actual)"
          />
        ),
        width: 180,
      },
      {
        headerName: "Complete",
        field: "completed",
        editable: true,
        valueFormatter: (value) => (!!value ? "Yes" : "No"),
        renderEditCell: (props) => <ToggleEditComponent {...props} />,
        width: 150,
      },
      {
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
        type: "actions",
        renderCell: ({ id }) => (
          <DataGridActions
            id={id}
            requiredFields={requiredFields}
            rowModesModel={rowModesModel}
            handleCancelClick={handleCancelClick}
            handleDeleteOpen={handleDeleteOpen}
            handleSaveClick={handleSaveClick}
            handleEditClick={handleEditClick}
          />
        ),
      },
    ];
  }, [
    data,
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteOpen,
    usingShiftKey,
    phaseNameLookup,
  ]);

/**
 * ProjectMilestones Component - Renders Project Milestone table
 * @return {JSX.Element}
 * @constructor
 */
const ProjectMilestones = ({
  projectId,
  loading,
  data,
  refetch,
  handleSnackbar,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const apiRef = useGridApiRef();

  // Mutations
  const [updateProjectMilestone] = useMutation(
    UPDATE_PROJECT_MILESTONES_MUTATION
  );
  const [deleteProjectMilestone] = useMutation(DELETE_PROJECT_MILESTONE);
  const [addProjectMilestone] = useMutation(ADD_PROJECT_MILESTONE);

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [usingShiftKey, setUsingShiftKey] = useState(false);

  useEffect(() => {
    if (data && data.moped_proj_milestones.length > 0) {
      setRows(data.moped_proj_milestones);
    }
  }, [data]);

  const milestoneNameLookup = useMilestoneNameLookup(data);
  const phaseNameLookup = usePhaseNameLookup(data?.moped_phases || []);

  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
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

  // when a user cancels editing by clicking the X in the actions
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.project_milestone_id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // adds a blank row to the table and updates the row modes model
  const onClickAddMilestone = () => {
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        milestone_id: null,
        description: null,
        date_actual: null,
        date_estimate: null,
        completed: false,
        isNew: true,
        project_milestone_id: id,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "moped_milestone" },
    }));
  };

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (updatedRow, originalRow) => {
    const updatedMilestoneData = updatedRow;
    // Remove unneeded variables
    delete updatedMilestoneData.__typename;

    // preventing empty strings from being saved
    updatedMilestoneData.description =
      !updatedMilestoneData.description ||
      updatedMilestoneData.description.trim() === ""
        ? null
        : updatedMilestoneData.description;

    updatedMilestoneData.milestone_id =
      updatedMilestoneData.moped_milestone?.milestone_id || null;

    // "moped_milestone_related_phase" is a column name only for rendering in DataGrid, the pertinent information is in the
    // moped_milestone object. Deleting from the payload since the db is not expecting it in this shape
    delete updatedMilestoneData.moped_milestone_related_phase;

    if (updatedRow.isNew) {
      delete updatedMilestoneData.isNew;
      delete updatedMilestoneData.id;
      delete updatedMilestoneData.project_milestone_id;
      delete updatedMilestoneData.moped_milestone;

      return (
        addProjectMilestone({
          variables: {
            objects: {
              ...updatedMilestoneData,
              project_id: projectId,
            },
          },
        })
          .then((response) => {
            // replace the temporary row id with the id from the record creation
            const record_id =
              response.data.insert_moped_proj_milestones.returning[0]
                .project_milestone_id;
            updatedRow.project_milestone_id = record_id;
          })
          .then(() => {
            refetch();
            handleSnackbar(true, "Project milestone added", "success");
          })
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(
              true,
              "Error adding project milestone",
              "error",
              error
            );
          })
      );
    } else {
      // Remove __typename since we removed it from updatedRow and check if the row has changed
      delete originalRow.__typename;
      const hasRowChanged = !isEqual(updatedRow, originalRow);

      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      } else {
        return (
          updateProjectMilestone({
            variables: updatedMilestoneData,
          })
            .then(() => {
              refetch();
              handleSnackbar(true, "Project milestone updated", "success");
            })
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => updatedRow)
            .catch((error) => {
              handleSnackbar(
                true,
                "Error updating project milestone",
                "error",
                error
              );
            })
        );
      }
    }
  };

  // handles row delete
  const handleDeleteClick = useCallback(
    (id) => () => {
      // remove row from rows in state
      setRows(rows.filter((row) => row.project_milestone_id !== id));

      deleteProjectMilestone({
        variables: {
          project_milestone_id: id,
        },
      })
        .then(() => {
          refetch();
          handleSnackbar(true, "Project milestone deleted", "success");
        })
        .then(() => setIsDeleteConfirmationOpen(false))
        .catch((error) => {
          handleSnackbar(
            true,
            "Error deleting project milestone",
            "error",
            error
          );
        });
    },

    [rows, deleteProjectMilestone, refetch, handleSnackbar]
  );

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    usingShiftKey,
    phaseNameLookup,
  });

  const checkIfShiftKey = (params, event) => {
    if (params.cellMode === GridRowModes.Edit && event.key === "Tab") {
      setUsingShiftKey(event.shiftKey);
    }
  };

  // Hide Milestone template dialog
  const handleTemplateModalClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
        ref={apiRef}
        autoHeight
        columns={dataGridColumns}
        rows={rows}
        loading={loading || !data}
        getRowId={(row) => row.project_milestone_id}
        editMode="row"
        onRowEditStop={handleRowEditStop(rows, setRows)}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        onCellKeyDown={checkIfShiftKey}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No project milestones to display" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Milestones",
            primaryActionButton: (
              <Button
                variant="contained"
                color="primary"
                onClick={onClickAddMilestone}
                startIcon={<AddCircleIcon />}
              >
                {"Add milestone"}
              </Button>
            ),
            secondaryActionButton: (
              <Button
                variant="outlined"
                onClick={() => setIsDialogOpen(true)}
                startIcon={<AddCircleIcon />}
              >
                {"From template"}
              </Button>
            ),
          },
        }}
      />
      {isDialogOpen && (
        <MilestoneTemplateModal
          isDialogOpen={isDialogOpen}
          handleDialogClose={handleTemplateModalClose}
          milestoneNameLookup={milestoneNameLookup}
          selectedMilestones={data.moped_proj_milestones}
          projectId={projectId}
          refetch={refetch}
          handleSnackbar={handleSnackbar}
        />
      )}
      <DeleteConfirmationModal
        type={"milestone"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </>
  );
};

export default ProjectMilestones;
