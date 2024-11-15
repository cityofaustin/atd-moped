import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import {
  DataGridPro,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import { v4 as uuidv4 } from "uuid";
import SubprojectsToolbar from "./SubprojectsToolbar";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "../../projectView/ProjectStatusBadge";
import SubprojectLookupComponent from "./SubprojectLookupComponent";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

import {
  SUBPROJECT_QUERY,
  UPDATE_PROJECT_SUBPROJECT,
  DELETE_PROJECT_SUBPROJECT,
} from "../../../../queries/subprojects";

/** Hook that provides memoized column settings */
const useColumns = ({
  data,
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
        renderCell: ({ row }) =>
          // prevents temp id from rendering when in edit mode
          row.project_name_full && row.project_id,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: true,
        width: 250,
        renderEditCell: (props) => (
          <SubprojectLookupComponent {...props} data={data} />
        ),
      },
      {
        headerName: "Status",
        field: "status",
        editable: false,
        width: 200,
        renderCell: ({ row }) =>
          // only render a badge once we exit edit mode and there is a phase
          row.moped_proj_phases && (
            <ProjectStatusBadge
              phaseName={row?.moped_proj_phases?.[0]?.moped_phase?.phase_name}
              phaseKey={row?.moped_proj_phases?.[0]?.moped_phase?.phase_key}
              condensed
            />
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
              icon={<DeleteOutlineIcon sx={{ fontSize: "24px" }} />}
              label="Delete"
              onClick={() => handleDeleteOpen(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];
  }, [
    data,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
  ]);

const SubprojectsTable = ({ projectId = null, refetchSummaryData }) => {
  const { loading, error, data, refetch } = useQuery(SUBPROJECT_QUERY, {
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

  useEffect(() => {
    if (data && data.subprojects.length > 0) {
      setRows(data.subprojects);
    }
  }, [data]);

  if (error) console.error(error);

  const handleAddSubprojectClick = () => {
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        project_id: id,
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

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.project_id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteOpen = useCallback((id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  }, []);

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
      })
      .then(() => setIsDeleteConfirmationOpen(false))
      .catch((error) => console.error(error));
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (updatedRow) => {
    const childProjectId = updatedRow?.project_name_full?.project_id;

    delete updatedRow.isNew;
    updatedRow.id = null;
    updatedRow.project_id = null;

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
        })
        // from the data grid docs:
        // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
        .then(() => updatedRow)
        .catch((error) => console.error(error))
    );
  };

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
  });

  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler errors={error}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        columns={dataGridColumns}
        rows={rows}
        autoHeight
        getRowId={(row) => row.project_id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        slots={{ toolbar: SubprojectsToolbar }}
        slotProps={{ toolbar: { onClick: handleAddSubprojectClick } }}
        editMode="row"
        processRowUpdate={processRowUpdate}
        hideFooter
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: "No subprojects to display" }}
        onRowEditStart={(params, event) => {
          event.defaultMuiPrevented = true; // disable editing rows
        }}
      />
      <DeleteConfirmationModal
        type={"funding source"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </ApolloErrorHandler>
  );
};

export default SubprojectsTable;
