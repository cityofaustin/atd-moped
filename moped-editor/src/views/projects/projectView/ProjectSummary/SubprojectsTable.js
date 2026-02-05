import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { Box, Button } from "@mui/material";
import { DataGridPro, GridRowModes } from "@mui/x-data-grid-pro";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { v4 as uuidv4 } from "uuid";

import DataGridActions from "src/components/DataGridPro/DataGridActions";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import ProjectStatusBadge from "../../projectView/ProjectStatusBadge";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import RenderFieldLink from "src/components/RenderFieldLink";

import {
  SUBPROJECT_SUMMARY_QUERY,
  PARENT_PROJECT_SUMMARY_QUERY,
  SUBPROJECT_OPTIONS_QUERY,
  UPDATE_PROJECT_SUBPROJECT,
  DELETE_PROJECT_SUBPROJECT,
} from "../../../../queries/subprojects";
import { handleRowEditStop } from "src/utils/dataGridHelpers";

const requiredFields = ["project_name_full"];

/** Hook that provides memoized column settings */
const useColumns = ({
  optionsData,
  optionsRefetch,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  deleteIcon,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "ID",
        field: "project_id",
        editable: false,
        width: 75,
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
            }}
          >
            {row?.project_id}
          </Box>
        ),
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: true,
        flex: 1,
        minWidth: 250,
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflow: "visible",
              textOverflow: "unset",
              lineHeight: 1.5,
            }}
          >
            <RenderFieldLink
              projectId={row?.project_id}
              value={row?.project_name_full}
            />
          </Box>
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
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
            }}
          >
            {row.moped_proj_phases ? (
              <ProjectStatusBadge
                phaseName={row?.moped_proj_phases?.[0]?.moped_phase?.phase_name}
                phaseKey={row?.moped_proj_phases?.[0]?.moped_phase?.phase_key}
                condensed
              />
            ) : (
              <div />
            )}
          </Box>
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
            deleteIcon={deleteIcon}
          />
        ),
      },
    ];
  }, [
    optionsData,
    optionsRefetch,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    deleteIcon,
  ]);

const SubprojectsTable = ({
  projectId = null,
  refetchSummaryData,
  handleSnackbar,
  isSubproject = false,
}) => {
  // Use different query based on whether this is a subproject
  const { loading, data, refetch } = useQuery(
    isSubproject ? PARENT_PROJECT_SUMMARY_QUERY : SUBPROJECT_SUMMARY_QUERY,
    {
      variables: { projectId: projectId },
      fetchPolicy: "no-cache",
    }
  );

  // separate query for options for the lookup autocomplete component
  const { data: optionsData, refetch: optionsRefetch } = useQuery(
    SUBPROJECT_OPTIONS_QUERY,
    {
      variables: { projectId: projectId },
      fetchPolicy: "no-cache",
    }
  );

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
    if (isSubproject) {
      // For subprojects, show the parent project
      if (
        data?.parentProject?.[0]?.parent_project_id &&
        data?.parentProject?.[0]?.moped_project
      ) {
        const parentProject = data.parentProject[0].moped_project;
        setRows([{ ...parentProject, id: parentProject.project_id }]);
      } else {
        setRows([]);
      }
    } else {
      // For parent projects, show the subprojects
      if (data && data.subprojects.length > 0) {
        // because we actually render the project_id in the table we run into issues with using
        // it as the datagrid row id, so we want to make a separate id value for that
        const rowsWithId = data.subprojects.map((row) => {
          return { ...row, id: row.project_id };
        });
        setRows(rowsWithId);
      } else {
        setRows([]);
      }
    }
  }, [data, isSubproject]);

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
    // The ID of the project whose parent will be removed (set to null)
    // - When viewing a subproject: unlink the current project from its parent
    // - When viewing a parent: unlink the selected child from this parent
    const projectToUnlinkId = isSubproject ? projectId : id;
    // remove row from rows in state
    setRows(rows.filter((row) => row.project_id !== id));

    deleteProjectSubproject({
      variables: {
        childProjectId: projectToUnlinkId,
      },
    })
      .then(() => {
        refetch();
        refetchSummaryData(); // Refresh subprojects in summary map
        const successMessage = isSubproject
          ? "Parent project unlinked"
          : "Subproject unlinked";
        handleSnackbar(true, successMessage, "success");
      })
      .then(() => setIsDeleteConfirmationOpen(false))
      .catch((error) => {
        const errorMessage = isSubproject
          ? "Error removing parent project"
          : "Error removing subproject";
        handleSnackbar(true, errorMessage, "error", error);
      });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // handles insert mutation triggered by row mode switching from edit to view
  const processRowUpdate = useCallback(
    (newRow) => {
      if (newRow.project_name_full) {
        const selectedProjectId = newRow?.project_name_full?.project_id;
        // newRow.project_name_full is an object containing the id, name, and phase for the project selected by the
        // lookup component, we will use it for setting all of the newRow fields needed to update the datagrid internal state
        newRow.project_id = newRow.project_name_full.project_id;
        newRow.moped_proj_phases = newRow.project_name_full.moped_proj_phases;
        newRow.project_name_full = newRow.project_name_full.project_name_full;
        newRow.isNew = false;

        // When isSubproject is true, we're setting the parent of the current project
        // When false, we're setting the parent of the selected project
        const parentProjectId = isSubproject ? selectedProjectId : projectId;
        const childProjectId = isSubproject ? projectId : selectedProjectId;

        return (
          updateProjectSubproject({
            variables: {
              parentProjectId: parentProjectId,
              childProjectId: childProjectId,
            },
          })
            .then(() => {
              refetch();
              refetchSummaryData(); // Refresh subprojects in summary map
              const successMessage = isSubproject
                ? "Parent project set"
                : "Subproject added";
              handleSnackbar(true, successMessage, "success");
            })
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => newRow)
            .catch((error) => {
              const errorMessage = isSubproject
                ? "Error setting parent project"
                : "Error adding subproject";
              handleSnackbar(true, errorMessage, "error", error);
            })
        );
      }
    },
    [
      projectId,
      isSubproject,
      refetch,
      refetchSummaryData,
      updateProjectSubproject,
      handleSnackbar,
    ]
  );

  const dataGridColumns = useColumns({
    optionsData,
    optionsRefetch,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    deleteIcon: <LinkOffIcon sx={{ fontSize: 24 }} />,
  });

  const noRelatedProjectsLabel = isSubproject
    ? "No parent project set"
    : "No subprojects to display";

  // Disable adding if viewing a subproject and a parent already exists
  const hasParent = isSubproject && rows.length > 0;
  const addButtonDisabled = isSubproject ? hasParent : false;

  return (
    <>
      <DataGridPro
        sx={{ ...dataGridProStyleOverrides, border: 0 }}
        columns={dataGridColumns}
        rows={rows || []}
        loading={loading || !data}
        autoHeight
        getRowHeight={() => "auto"}
        density="comfortable"
        getRowId={(row) => row.id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onProcessRowUpdateError={(error) => console.error(error)}
        slots={{ toolbar: DataGridToolbar }}
        slotProps={{
          toolbar: {
            title: isSubproject ? "Parent project" : "Subprojects",
            primaryActionButton: (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddLinkIcon />}
                onClick={handleAddSubprojectClick}
                disabled={addButtonDisabled}
              >
                Link subproject
              </Button>
            ),
          },
        }}
        editMode="row"
        processRowUpdate={processRowUpdate}
        onRowEditStop={handleRowEditStop(rows, setRows)}
        hideFooter
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: noRelatedProjectsLabel }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        onRowEditStart={(params, event) => {
          event.defaultMuiPrevented = true; // disable editing rows
        }}
      />
      <DeleteConfirmationModal
        type={isSubproject ? "parent project" : "subproject"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
        confirmationText={
          isSubproject
            ? "Are you sure you want to unlink the parent project?"
            : "Are you sure you want to unlink this subproject?"
        }
        actionButtonText="Unlink"
        actionButtonIcon={<LinkOffIcon />}
      />
    </>
  );
};

export default SubprojectsTable;
