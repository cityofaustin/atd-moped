import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import { CircularProgress } from "@mui/material";
import { DataGridPro, GridRowModes } from "@mui/x-data-grid-pro";

import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import {
  USER_SAVED_VIEWS_QUERY,
  UPDATE_USER_SAVED_VIEW,
  DELETE_USER_SAVED_VIEW,
} from "src/queries/userSavedViews";
import { getSessionDatabaseData } from "src/auth/user";

import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import DeleteConfirmationModal from "../projects/projectView/DeleteConfirmationModal";

/** Hook that provides memoized column settings */
const useColumns = ({
  data,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Description",
        field: "description",
        editable: true,
        width: 500,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "URL",
        field: "url",
        editable: false,
        width: 500,
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
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
  ]);

const UserSavedViewsTable = ({ handleSnackbar }) => {
  // user data
  const userSessionData = getSessionDatabaseData();
  const userId = userSessionData?.user_id;

  const { loading, error, data, refetch } = useQuery(USER_SAVED_VIEWS_QUERY, {
    variables: {
      userId: userId,
    },
    fetchPolicy: "no-cache",
  });

  const [updateUserSavedView] = useMutation(UPDATE_USER_SAVED_VIEW);
  const [deleteUserSavedView] = useMutation(DELETE_USER_SAVED_VIEW);

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // sets the data grid row data when query data is fetched
  useEffect(() => {
    if (data && data.moped_user_saved_views.length > 0) {
      setRows(data.moped_user_saved_views);
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
    // remove row from rows in state
    setRows(rows.filter((row) => row.id !== id));

    deleteUserSavedView({
      variables: {
        id,
      },
    })
      .then(() => {
        refetch();
        handleSnackbar(true, "Saved view removed", "success");
      })
      .then(() => setIsDeleteConfirmationOpen(false))
      .catch((error) => {
        handleSnackbar(true, "Error removing saved view", "error", error);
      });
  };

  const processRowUpdate = (updatedRow, originalRow) => {
    if (updatedRow.description !== originalRow.description) {
      return (
        updateUserSavedView({
          variables: {
            id: originalRow.id,
            description: updatedRow.description,
          },
        })
          .then(() => {
            refetch();
            handleSnackbar(true, "Saved view updated", "success");
          })
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(true, "Error updating saved view", "error", error);
          })
      );
    }
  };

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
  });

  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler errors={error}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        columns={dataGridColumns}
        rows={rows}
        autoHeight
        getRowId={(row) => row.id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onProcessRowUpdateError={(error) => console.error}
        editMode="row"
        processRowUpdate={processRowUpdate}
        hideFooter
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: "No saved queries to display" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        onRowEditStart={(params, event) => {
          event.defaultMuiPrevented = true; // disable editing rows
        }}
      />
      <DeleteConfirmationModal
        type={"saved query"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </ApolloErrorHandler>
  );
};

export default UserSavedViewsTable;
