import React, { useState, useEffect, useMemo, useCallback } from "react";
import isEqual from "lodash/isEqual";
import { v4 as uuidv4 } from "uuid";

import { CircularProgress } from "@mui/material";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  DataGridPro,
  GridRowModes,
  GridActionsCellItem,
  useGridApiRef,
  // gridStringOrNumberComparator,
} from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import ProjectMilestoneToolbar from "./ProjectMilestones/ProjectMilestoneToolbar";
import DataGridTextField from "./DataGridTextField";

// Query
import {
  UPDATE_PROJECT_MILESTONES_MUTATION,
  DELETE_PROJECT_MILESTONE,
  ADD_PROJECT_MILESTONE,
} from "../../../queries/project";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";

// Helpers
import { phaseNameLookup } from "src/utils/timelineTableHelpers";
import ToggleEditComponent from "./ToggleEditComponent";
import MilestoneTemplateModal from "./ProjectMilestones/MilestoneTemplateModal";
import MilestoneAutocompleteComponent from "./ProjectMilestones/MilestoneAutocompleteComponent";
import DataGridDateFieldEdit from "./ProjectMilestones/DataGridDateFieldEdit";

const useColumns = ({
  // classes,
  data,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  // handleDeleteOpen,
  milestoneNameLookup,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Milestone",
        field: "milestone_id",
        renderCell: ({ row }) => row.moped_milestone?.milestone_name,
        // input validation:
        preProcessEditCellProps: (params) => ({
          ...params.props,
          error: !params.props.value,
        }),
        editable: true,
        renderEditCell: (props) => (
          <MilestoneAutocompleteComponent
            {...props}
            milestoneNameLookup={milestoneNameLookup}
          />
        ),
        width: 250,
      },
      {
        headerName: "Description",
        field: "description",
        width: 200,
        editable: true,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "Related phase",
        field: "moped_milestone",
        editable: false, // would it be cool for this to update when someone edits the milestone
        valueGetter: (value) => {
          return phaseNameLookup(data)[value?.related_phase_id] ?? "";
        },
        width: 150,
      },
      {
        headerName: "Completion estimate",
        field: "date_estimate",
        editable: true,
        valueFormatter: (value) =>
          value ? format(parseISO(value), "MM/dd/yyyy") : undefined,
        renderEditCell: (props) => (
          <DataGridDateFieldEdit
            {...props}
            name="date_estimate"
            label="Completion estimate"
          />
        ),
        width: 175,
      },
      {
        headerName: "Date completed",
        field: "date_actual",
        editable: true,
        valueFormatter: (value) =>
          value ? format(parseISO(value), "MM/dd/yyyy") : undefined,
        renderEditCell: (props) => (
          <DataGridDateFieldEdit
            {...props}
            name="date_actual"
            label="Date (actual)"
          />
        ),
        width: 175,
      },
      {
        headerName: "Complete",
        field: "completed",
        editable: true,
        valueFormatter: (value) => (!!value ? "Yes" : "No"),
        renderEditCell: (props) => (
          <ToggleEditComponent {...props} name="completed" />
        ),
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
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<CheckIcon sx={{ fontSize: "24px" }} />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CloseIcon sx={{ fontSize: "24px" }} />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon sx={{ fontSize: "24px" }} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteOutlineIcon sx={{ fontSize: "24px" }} />}
              label="Delete"
              //onClick={() => handleDeleteOpen(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];
  }, [
    // classes,
    data,
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    // handleDeleteOpen,
    milestoneNameLookup,
  ]);
/**
 * ProjectMilestones Component - Renders Project Milestone table
 * @return {JSX.Element}
 * @constructor
 */
const ProjectMilestones = ({ projectId, loading, data, refetch }) => {
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

  useEffect(() => {
    if (data && data.moped_proj_milestones.length > 0) {
      setRows(data.moped_proj_milestones);
    }
  }, [data]);

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
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "funding_source_id" },
    }));
  };

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (updatedRow, originalRow) => {
    const updatedMilestoneData = updatedRow;
    console.log(updatedRow);
    // Remove unneeded variables
    delete updatedMilestoneData.__typename;

    // preventing empty strings from being saved
    updatedMilestoneData.description =
      !updatedMilestoneData.description ||
      updatedMilestoneData.description.trim() === ""
        ? null
        : updatedMilestoneData.description;

    if (updatedRow.isNew) {
      delete updatedMilestoneData.isNew;
      delete updatedMilestoneData.id;
      delete updatedMilestoneData.project_milestone_id;

      console.log(updatedMilestoneData, projectId);

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
          .then(() => refetch())
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => {
            console.error(error.message);
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
            .then(() => refetch())
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => updatedRow)
            .catch((error) => {
              console.error(error.message);
            })
        );
      }
    }
  };

  const handleProcessUpdateError = (error) => {
    console.error(error.message);
  };

  /**
   * Milestone table lookup object formatted into the shape that <Autocomplete> expects.
   * Ex: { 1: "Award", 2: "Bid", ...}
   */
  const milestoneNameLookup = data.moped_milestones.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.milestone_id]: item.milestone_name,
      }),
    {}
  );

  const dataGridColumns = useColumns({
    // classes,
    data,
    rowModesModel,
    // handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    milestoneNameLookup,
  });

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

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
        getRowId={(row) => row.project_milestone_id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessUpdateError}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No project milestones to display" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        slots={{
          toolbar: ProjectMilestoneToolbar,
        }}
        slotProps={{
          toolbar: {
            addAction: onClickAddMilestone,
            setIsDialogOpen: setIsDialogOpen,
          },
        }}
      />
      <MilestoneTemplateModal
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleTemplateModalClose}
        milestoneNameLookup={milestoneNameLookup}
        selectedMilestones={data.moped_proj_milestones}
        projectId={projectId}
        refetch={refetch}
      />
    </>
  );
};

export default ProjectMilestones;
