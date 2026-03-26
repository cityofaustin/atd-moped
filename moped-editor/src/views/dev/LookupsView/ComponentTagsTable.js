import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash.isequal";
import { v4 as uuidv4 } from "uuid";
import { Button, Tooltip, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  GridRowModes,
  GridRowEditStopReasons,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";
import { useLocation } from "react-router-dom";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import CopyTextButton from "src/components/CopyTextButton";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import { handleRowEditStop } from "src/utils/dataGridHelpers";
import {
  COMPONENT_TAGS_QUERY,
  ADD_COMPONENT_TAG,
  UPDATE_COMPONENT_TAG,
} from "src/queries/tableLookups";
import {
  transformDatabaseToGrid,
  transformGridToDatabase,
} from "./componentTagsHelpers";
import { createRecordKeyHash } from "src/utils/urls";

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
        minWidth: 200,
        flex: 1,
        editable: canEdit,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "Type",
        field: "type",
        minWidth: 150,
        flex: 1,
        editable: canEdit,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "Full name",
        field: "full_name",
        minWidth: 250,
        flex: 1,
        editable: false,
      },
      {
        headerName: "Slug",
        field: "slug",
        minWidth: 180,
        flex: 1,
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

const ComponentTagsTable = ({ canEdit, handleSnackbar, onScrollToTop }) => {
  const apiRef = useGridApiRef();
  const { pathname } = useLocation();
  const recordKeyHash = createRecordKeyHash("moped_component_tags");

  const { data, loading, refetch } = useQuery(COMPONENT_TAGS_QUERY, {
    variables: {
      where: { is_deleted: { _eq: false } },
    },
    fetchPolicy: "no-cache",
  });

  const [addComponentTag] = useMutation(ADD_COMPONENT_TAG);
  const [updateComponentTag] = useMutation(UPDATE_COMPONENT_TAG);

  const tableRows = useMemo(
    () => transformDatabaseToGrid(data?.moped_component_tags),
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

  const handleComponentTagsRowEditStop = useCallback(
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
        updateComponentTag({
          variables: {
            id: deletedRow.id,
            set: { is_deleted: true },
          },
        })
          .then(() => refetch())
          .then(() => {
            setIsDeleteConfirmationOpen(false);
            handleSnackbar(true, "Component tag removed", "success");
          })
          .catch((error) => {
            handleSnackbar(
              true,
              "Error removing component tag",
              "error",
              error
            );
          });
      } else {
        setIsDeleteConfirmationOpen(false);
      }
    },
    [rows, updateComponentTag, refetch, handleSnackbar]
  );

  const processRowUpdate = (updatedRow, originalRow) => {
    const mutationData = transformGridToDatabase(updatedRow);

    if (updatedRow.isNew) {
      return addComponentTag({
        variables: {
          object: {
            name: mutationData.name || null,
            type: mutationData.type || null,
            slug: mutationData.slug,
          },
        },
      })
        .then((response) => {
          const newRecord = response.data?.insert_moped_component_tags_one;
          if (newRecord) {
            updatedRow.id = newRecord.id;
            updatedRow.full_name = newRecord.full_name;
            delete updatedRow.isNew;
          }
          refetch();
          handleSnackbar(true, "Component tag added", "success");
          return updatedRow;
        })
        .catch((error) => {
          handleSnackbar(true, "Error adding component tag", "error", error);
          throw error;
        });
    }

    delete originalRow.__typename;
    delete updatedRow.__typename;
    const hasRowChanged = !isEqual(updatedRow, originalRow);

    if (!hasRowChanged) {
      return Promise.resolve(updatedRow);
    }

    return updateComponentTag({
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
        handleSnackbar(true, "Component tag updated", "success");
        return updatedRow;
      })
      .catch((error) => {
        handleSnackbar(true, "Error updating component tag", "error", error);
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

  const isEditMode = Object.values(rowModesModel).some(
    (m) => m?.mode === GridRowModes.Edit
  );

  return (
    <>
      <MopedDataGrid
        sx={{ border: "none" }}
        apiRef={apiRef}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        editMode="row"
        loading={loading}
        rowModesModel={rowModesModel}
        onRowEditStop={handleComponentTagsRowEditStop}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        localeText={{ noRowsLabel: "No component tags" }}
        initialState={{ pinnedColumns: canEdit ? { right: ["edit"] } : {} }}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: (
              <>
                Component tags
                {onScrollToTop && (
                  <Tooltip title="Return to top of page">
                    <IconButton onClick={onScrollToTop} size="large">
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ),
            primaryActionButton: (
              <CopyTextButton
                copyButtonText="Copy link"
                textToCopy={`${window.location.origin}${pathname}${recordKeyHash}`}
              />
            ),
            secondaryActionButton: canEdit ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={handleAddRecordClick}
                disabled={isEditMode}
              >
                Add tag
              </Button>
            ) : null,
          },
        }}
      />
      <DeleteConfirmationModal
        type="component tag"
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
        confirmationText="Are you sure you want to remove this component tag? It will be hidden from the data dictionary and downstream views."
        actionButtonText="Remove"
      />
    </>
  );
};

export default ComponentTagsTable;
