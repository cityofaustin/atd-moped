import React, { 
  useState,
  useMemo,
  useEffect,
  // useCallback
} from "react";
import { 
  useQuery,
  // useMutation 
} from "@apollo/client";

// Material
import { CircularProgress, Box } from "@mui/material";
import {
  DataGridPro,
  // GridRowModes
} from "@mui/x-data-grid-pro";

import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { USER_SAVED_VIEWS_QUERY } from "src/queries/userSavedViews";
import { getSessionDatabaseData } from "src/auth/user";

import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
// import DataGridActions from "src/components/DataGridPro/DataGridActions";

/** Hook that provides memoized column settings */
const useColumns = ({
  data,
  rowModesModel,
  // handleDeleteOpen,
  // handleSaveClick,
  // handleCancelClick,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Description",
        field: "description",
        editable: false,
        width: 500,
      },
      {
        headerName: "URL",
        field: "url",
        editable: false,
        width: 500,
      },
      // {
      //   headerName: "",
      //   field: "edit",
      //   hideable: false,
      //   filterable: false,
      //   sortable: false,
      //   editable: false,
      //   type: "actions",
      //   renderCell: ({ id }) => (
      //     <DataGridActions
      //       id={id}
      //       requiredFields={requiredFields}
      //       rowModesModel={rowModesModel}
      //       handleCancelClick={handleCancelClick}
      //       handleDeleteOpen={handleDeleteOpen}
      //       handleSaveClick={handleSaveClick}
      //     />
      //   ),
      // },
    ];
  }, [
    // data,
    // rowModesModel,
    // handleDeleteOpen,
    // handleSaveClick,
    // handleCancelClick,
  ]);

const UserSavedViewsTable = () => {

  // user data
  const userSessionData = getSessionDatabaseData();
  const userId = userSessionData?.user_id;

  const {
    loading,
    error,
    data,
    // refetch 
  } = useQuery(USER_SAVED_VIEWS_QUERY, {
    variables: {
      userId: userId,
    },
    fetchPolicy: "no-cache",
  });

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  // const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
  //   useState(false);
  // const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // sets the data grid row data when query data is fetched
  useEffect(() => {
    if (data && data.moped_user_saved_views.length > 0) {
      setRows(data.moped_user_saved_views);
    }
  }, [data]);

  // // handles saving the new row by clicking the check icon
  // const handleSaveClick = useCallback(
  //   (id) => () => {
  //     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  //   },
  //   [rowModesModel]
  // );

  // // handles canceling adding a new row by clicking the X icon
  // const handleCancelClick = useCallback(
  //   (id) => () => {
  //     setRowModesModel({
  //       ...rowModesModel,
  //       [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //     });
  //     const editedRow = rows.find((row) => row.id === id);
  //     if (editedRow.isNew) {
  //       setRows(rows.filter((row) => row.id !== id));
  //     }
  //   },
  //   [rowModesModel, rows]
  // );

  // // open the delete confirmation modal
  // const handleDeleteOpen = useCallback(
  //   (id) => () => {
  //     setIsDeleteConfirmationOpen(true);
  //     setDeleteConfirmationId(id);
  //   },
  //   []
  // );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = () => {
    console.log("update a row");
  };

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    // handleDeleteOpen,
    // handleSaveClick,
    // handleCancelClick,
  });

  if (loading || !data) return <CircularProgress />;


  return (
    <ApolloErrorHandler errors={error}>
      <Box my={4}>
        <DataGridPro
          sx={dataGridProStyleOverrides}
          columns={dataGridColumns}
          rows={rows}
          autoHeight
          getRowId={(row) => row.id}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onProcessRowUpdateError={(error) => console.error}
          // slots={{ toolbar: SubprojectsToolbar }}
          // slotProps={{ toolbar: { onClick: handleAddSubprojectClick } }}
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
      </Box>
    </ApolloErrorHandler>
  );
};

export default UserSavedViewsTable;
