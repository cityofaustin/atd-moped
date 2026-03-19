import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash.isequal";
import { v4 as uuidv4 } from "uuid";
import {
  DataGridPro,
  GridRowModes,
  GridRowEditStopReasons,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import { handleRowEditStop } from "src/utils/dataGridHelpers";
import {
  PROJECT_TAGS_QUERY,
  INSERT_PROJECT_TAG,
  UPDATE_PROJECT_TAG,
} from "src/queries/dataDictionary";
import {
  transformDatabaseToGrid,
  transformGridToDatabase,
} from "./projectTagsHelpers";

const requiredFields = ["name", "type", "slug"];

const useColumns = ({
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  canEdit,
}) =>
  useMemo(() => {
    const baseColumns = [
      {
        headerName: "Name",
        field: "name",
        width: 200,
        editable: canEdit,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "Type",
        field: "type",
        width: 150,
        editable: canEdit,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "Full name",
        field: "full_name",
        width: 250,
        editable: false,
      },
      {
        headerName: "Slug",
        field: "slug",
        width: 180,
        editable: canEdit,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
    ];

    if (canEdit) {
      baseColumns.push({
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
        type: "actions",
        width: 100,
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
      });
    }

    return baseColumns;
  }, [
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    canEdit,
  ]);

const ProjectTagsTable = ({ canEdit, handleSnackbar, addTrigger = 0 }) => {
  const apiRef = useGridApiRef();

  const { data, loading, refetch } = useQuery(PROJECT_TAGS_QUERY, {
    variables: {
      where: { is_deleted: { _eq: false } },
    },
    fetchPolicy: "no-cache",
  });

  const [insertProjectTag] = useMutation(INSERT_PROJECT_TAG);
  const [updateProjectTag] = useMutation(UPDATE_PROJECT_TAG);

  const tableRows = useMemo(
    () => transformDatabaseToGrid(data?.moped_tags),
    [data]
  );

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(
    false
  );
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  useEffect(() => {
    setRows(tableRows);
  }, [tableRows]);

  const handleDeleteOpen = useCallback((id) => () => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProjectTagsRowEditStop = useCallback(
    (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
        return;
      }
      handleRowEditStop(rows, setRows)(params, event);
    },
    [rows]
  );

  const handleAddRecordClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        name: "",
        type: "",
        slug: "",
        full_name: null,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  useEffect(() => {
    if (canEdit && addTrigger > 0) {
      handleAddRecordClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTrigger, canEdit]);

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

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteClick = useCallback(
    (id) => () => {
      setRows(rows.filter((row) => row.id !== id));
      const deletedRow = rows.find((row) => row.id === id);
      if (!deletedRow?.isNew) {
        updateProjectTag({
          variables: {
            id: deletedRow.id,
            set: { is_deleted: true },
          },
        })
          .then(() => refetch())
          .then(() => {
            setIsDeleteConfirmationOpen(false);
            handleSnackbar(true, "Project tag removed", "success");
          })
          .catch((error) => {
            handleSnackbar(
              true,
              "Error removing project tag",
              "error",
              error
            );
          });
      } else {
        setIsDeleteConfirmationOpen(false);
      }
    },
    [rows, updateProjectTag, refetch, handleSnackbar]
  );

  const processRowUpdate = (updatedRow, originalRow) => {
    const mutationData = transformGridToDatabase(updatedRow);

    if (updatedRow.isNew) {
      return insertProjectTag({
        variables: {
          object: {
            name: mutationData.name || null,
            type: mutationData.type || null,
            slug: mutationData.slug,
          },
        },
      })
        .then((response) => {
          const newRecord = response.data?.insert_moped_tags_one;
          if (newRecord) {
            updatedRow.id = newRecord.id;
            updatedRow.full_name = newRecord.full_name;
            delete updatedRow.isNew;
          }
          refetch();
          handleSnackbar(true, "Project tag added", "success");
          return updatedRow;
        })
        .catch((error) => {
          handleSnackbar(true, "Error adding project tag", "error", error);
          throw error;
        });
    }

    delete originalRow.__typename;
    delete updatedRow.__typename;
    const hasRowChanged = !isEqual(updatedRow, originalRow);

    if (!hasRowChanged) {
      return Promise.resolve(updatedRow);
    }

    return updateProjectTag({
      variables: {
        id: updatedRow.id,
        set: {
          name: mutationData.name ?? null,
          type: mutationData.type ?? null,
          slug: mutationData.slug,
        },
      },
    })
      .then(() => {
        refetch();
        handleSnackbar(true, "Project tag updated", "success");
        return updatedRow;
      })
      .catch((error) => {
        handleSnackbar(true, "Error updating project tag", "error", error);
        throw error;
      });
  };

  const columns = useColumns({
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    canEdit,
  });

  return (
    <>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        editMode="row"
        loading={loading}
        rowModesModel={rowModesModel}
        onRowEditStop={handleProjectTagsRowEditStop}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableRowSelectionOnClick
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No project tags" }}
        initialState={{ pinnedColumns: canEdit ? { right: ["edit"] } : {} }}
      />
      <DeleteConfirmationModal
        type="project tag"
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
        confirmationText="Are you sure you want to remove this project tag? It will be hidden from the data dictionary and downstream views."
        actionButtonText="Remove"
      />
    </>
  );
};

export default ProjectTagsTable;
