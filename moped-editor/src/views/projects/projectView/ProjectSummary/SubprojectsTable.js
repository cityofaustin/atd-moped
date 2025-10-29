import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { CircularProgress } from "@mui/material";
import { DataGridPro, GridRowModes } from "@mui/x-data-grid-pro";
import { v4 as uuidv4 } from "uuid";

import DataGridActions from "src/components/DataGridPro/DataGridActions";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import SubprojectsToolbar from "./SubprojectsToolbar";
import ProjectStatusBadge from "../../projectView/ProjectStatusBadge";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import RenderFieldLink from "src/components/RenderFieldLink";

import {
  SUBPROJECT_SUMMARY_QUERY,
  SUBPROJECT_OPTIONS_QUERY,
  UPDATE_PROJECT_SUBPROJECT,
  DELETE_PROJECT_SUBPROJECT,
} from "../../../../queries/subprojects";
import { handleRowEditStop } from "src/utils/dataGridHelpers";

const requiredFields = ["project_name_full"];

/** Hook that provides memoized column settings */
const useColumns = ({
  data,
  refetch,
  optionsData,
  optionsRefetch,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "ID",
        field: "project_id",
        editable: false,
        width: 75,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: true,
        width: 250,
        renderCell: ({ row }) => (
          <RenderFieldLink
            projectId={row?.project_id}
            value={row?.project_name_full}
          />
        ),
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name="project"
            options={optionsData?.subprojectOptions}
            autocompleteProps={{
              getOptionLabel: (option) =>
                `${option.project_id} - ${option.project_name_full}`,
            }}
            refetch={optionsRefetch}
          />
        ),
      },
      {
        headerName: "Status",
        field: "moped_proj_phases",
        editable: false,
        width: 200,
        // valueGetter allows us to derive from a nested field which will be used for sorting/filtering
        valueGetter: (value) =>
          value?.[0]?.moped_phase?.phase_name || "Unknown",
        renderCell: ({ row }) =>
          // only render a badge once we exit edit mode and there is a phase
          row.moped_proj_phases ? (
            <ProjectStatusBadge
              phaseName={row?.moped_proj_phases?.[0]?.moped_phase?.phase_name}
              phaseKey={row?.moped_proj_phases?.[0]?.moped_phase?.phase_key}
              condensed
            />
          ) : (
            <div />
          ),
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
          />
        ),
      },
    ];
  }, [
    data,
    refetch,
    optionsData,
    optionsRefetch,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
  ]);

const SubprojectsTable = ({
  projectId = null,
  refetchSummaryData,
  handleSnackbar,
}) => {
  const { loading, data, refetch } = useQuery(SUBPROJECT_SUMMARY_QUERY, {
    variables: { projectId: projectId },
    fetchPolicy: "no-cache",
  });

  const { data: optionsData, refetch: optionsRefetch } = useQuery(SUBPROJECT_OPTIONS_QUERY, {
     variables: { projectId: projectId },
     fetchPolicy: "no-cache",
   }); 

  const [updateProjectSubproject] = useMutation(UPDATE_PROJECT_SUBPROJECT);
  const [deleteProjectSubproject] = useMutation(DELETE_PROJECT_SUBPROJECT);

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // sets the data grid row data when query data is fetched
  useEffect(() => {
    if (data && data.subprojects.length > 0) {
      // because we actually render the project_id in the table we run into issues with using
      // it as the datagrid row id, so we want to make a separate id value for that
      const rowsWithId = data.subprojects.map((row) => {
        return { ...row, id: row.project_id };
      });
      setRows(rowsWithId);
    }
  }, [data]);

  // adds a blank row to the table and updates the row modes model
  const handleAddSubprojectClick = () => {
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id: id,
        project_id: null,
        project_name_full: null,
        status: null,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "project_name_full" },
    }));
  };

  // handles saving the new row by clicking the check icon
  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  // handles canceling adding a new row by clicking the X icon
  const handleCancelClick = useCallback(
    (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    },
    [rowModesModel, rows]
  );

  // open the delete confirmation modal
  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  // handles row delete
  const handleDeleteClick = (id) => () => {
    const childProjectId = id;
    // remove row from rows in state
    setRows(rows.filter((row) => row.project_id !== id));

    deleteProjectSubproject({
      variables: {
        childProjectId: childProjectId,
      },
    })
      .then(() => {
        refetch();
        refetchSummaryData(); // Refresh subprojects in summary map
        handleSnackbar(true, "Subproject removed", "success");
      })
      .then(() => setIsDeleteConfirmationOpen(false))
      .catch((error) => {
        handleSnackbar(true, "Error removing subproject", "error", error);
      });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // handles insert mutation triggered by row mode switching from edit to view
  const processRowUpdate = useCallback(
    (newRow) => {
      if (newRow.project_name_full) {
        const childProjectId = newRow?.project_name_full?.project_id;
        // newRow.project_name_full is an object containing the id, name, and phase for the project selected by the
        // lookup component, we will use it for setting all of the newRow fields needed to update the datagrid internal state
        newRow.project_id = newRow.project_name_full.project_id;
        newRow.moped_proj_phases = newRow.project_name_full.moped_proj_phases;
        newRow.project_name_full = newRow.project_name_full.project_name_full;
        newRow.isNew = false;

        return (
          updateProjectSubproject({
            variables: {
              parentProjectId: projectId,
              childProjectId: childProjectId,
            },
          })
            .then(() => {
              refetch();
              refetchSummaryData(); // Refresh subprojects in summary map
              handleSnackbar(true, "Subproject added", "success");
            })
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => newRow)
            .catch((error) => {
              handleSnackbar(true, "Error adding subproject", "error", error);
            })
        );
      }
    },
    [
      projectId,
      refetch,
      refetchSummaryData,
      updateProjectSubproject,
      handleSnackbar,
    ]
  );

  const dataGridColumns = useColumns({
    data,
    refetch,
    optionsData,
    optionsRefetch,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
  });

  if (loading || !data) return <CircularProgress />;

  return (
    <>
      <DataGridPro
        sx={{ ...dataGridProStyleOverrides, border: 0 }}
        columns={dataGridColumns}
        rows={rows}
        autoHeight
        getRowId={(row) => row.id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onProcessRowUpdateError={(error) => console.error}
        slots={{ toolbar: SubprojectsToolbar }}
        slotProps={{ toolbar: { onClick: handleAddSubprojectClick } }}
        editMode="row"
        processRowUpdate={processRowUpdate}
        onRowEditStop={handleRowEditStop(rows, setRows)}
        hideFooter
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: "No subprojects to display" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        onRowEditStart={(params, event) => {
          event.defaultMuiPrevented = true; // disable editing rows
        }}
      />
      <DeleteConfirmationModal
        type={"subproject"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </>
  );
};

export default SubprojectsTable;
