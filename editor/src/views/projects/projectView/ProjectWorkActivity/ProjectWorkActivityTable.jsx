import { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import ExternalLink from "src/components/ExternalLink";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import ProjectWorkActivitiesDialog from "./ProjectWorkActivityDialog";
import { getUserFullName } from "src/utils/userNames";
import { WORK_ACTIVITY_QUERY, DELETE_WORK_ACTIVITY } from "src/queries/funding";
import { currencyFormatter } from "src/utils/numberFormatters";
import { useHiddenColumnsSettings } from "src/utils/localStorageHelpers";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectWorkActivityFilesAttachmentDialog from "./ProjectWorkActivityFilesAttachmentDialog";
import FormattedDateString from "src/utils/FormattedDateString";

/** Hook that provides memoized column settings */
const useColumns = ({
  deleteInProgress,
  onDeleteActivity,
  setEditActivity,
  handleFileAttachmentClick,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "ID",
        field: "reference_id",
        width: 125,
        defaultVisible: true,
      },
      {
        headerName: "Workgroup/Contractor",
        field: "workgroup_contractor",
        width: 175,
        defaultVisible: true,
      },
      {
        headerName: "Contract #",
        field: "contract_number",
        width: 150,
        defaultVisible: true,
      },
      {
        headerName: "Description",
        field: "description",
        width: 200,
        defaultVisible: true,
      },
      {
        headerName: "Work Assignment",
        field: "work_assignment_id",
        width: 150,
        defaultVisible: true,
      },
      {
        headerName: "Task Order(s)",
        field: "task_orders",
        defaultVisible: true,
        width: 200,
        valueGetter: (field) => field?.map((tk) => tk.display_name).join(", "),
        renderCell: ({ row }) => (
          <div>
            {row.task_orders?.map((tk) => (
              <div key={tk.task_order}>{tk.display_name}</div>
            ))}
          </div>
        ),
      },
      {
        headerName: "Work Order Link",
        field: "work_order_url",
        width: 175,
        defaultVisible: true,
        renderCell: ({ row }) =>
          row.work_order_url ? (
            <ExternalLink
              url={row.work_order_url}
              linkColor="primary"
              useFriendlyUrl
              showExternalLinkIcon={false}
            />
          ) : null,
      },
      {
        headerName: "Status",
        field: "moped_work_activity_status",
        defaultVisible: true,
        valueGetter: (field) => field.name,
        width: 150,
      },
      {
        headerName: "Amount",
        field: "contract_amount",
        width: 150,
        defaultVisible: true,
        valueGetter: (field) =>
          isNaN(parseInt(field)) ? null : currencyFormatter.format(field),
      },
      {
        headerName: "Status update",
        field: "status_note",
        width: 150,
        defaultVisible: true,
      },
      {
        headerName: "Updated by",
        field: "updated_by_user",
        width: 150,
        defaultVisible: true,
        valueGetter: (field) => getUserFullName(field),
      },
      {
        headerName: "Updated at",
        field: "updated_at",
        width: 150,
        defaultVisible: true,
        renderCell: ({ row }) => (
          <FormattedDateString
            date={row.updated_at}
            primary="relative"
            secondary="absolute"
          />
        ),
      },
      {
        headerName: "",
        field: "Edit",
        hideable: false,
        filterable: false,
        sortable: false,
        defaultVisible: true,
        width: 110,
        type: "actions",
        renderCell: ({ id, row }) => {
          // do we want to use data grid actions
          return deleteInProgress ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            <>
              <IconButton
                aria-label="edit"
                sx={{ color: "inherit", padding: "5px" }}
                onClick={() => setEditActivity(row)}
              >
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="attachment"
                sx={{ color: "inherit", padding: "5px" }}
                onClick={handleFileAttachmentClick(id)}
              >
                <AttachFileOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                sx={{ color: "inherit", padding: "5px" }}
                onClick={() => onDeleteActivity(id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </>
          );
        },
      },
    ];
  }, [
    deleteInProgress,
    onDeleteActivity,
    setEditActivity,
    handleFileAttachmentClick,
  ]);

const ProjectWorkActivitiesTable = ({ handleSnackbar }) => {
  const [editActivity, setEditActivity] = useState(null);
  const { projectId } = useParams();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  /* File attachment state and handlers */
  const [fileAttachmentId, setFileAttachmentId] = useState(null);
  const [isFileAttachmentDialogOpen, setIsFileAttachmentDialogOpen] =
    useState(false);

  const { loading, data, refetch } = useQuery(WORK_ACTIVITY_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  const [deleteContract, { loading: deleteInProgress }] =
    useMutation(DELETE_WORK_ACTIVITY);

  const activities = data?.moped_proj_work_activity;

  const onClickAddActivity = () => setEditActivity({ project_id: projectId });

  const onDeleteActivity = useCallback((id) => {
    setActivityToDelete(id);
    setIsDeleteConfirmationOpen(true);
  }, []);

  const handleDeleteConfirmed = useCallback(() => {
    if (activityToDelete) {
      deleteContract({ variables: { id: activityToDelete } })
        .then(() => refetch())
        .then(() => {
          setActivityToDelete(null);
          setIsDeleteConfirmationOpen(false);
          handleSnackbar(true, "Work activity deleted", "success");
        })
        .catch((error) => {
          handleSnackbar(true, "Error deleting work activity", "error", error);
        });
    }
  }, [activityToDelete, deleteContract, refetch, handleSnackbar]);

  const onSubmitCallback = ({ mutation }) => {
    refetch().then(() => {
      setEditActivity(null);
      if (mutation.data.update_moped_proj_work_activity_by_pk) {
        handleSnackbar(true, "Work activity updated", "success");
      }
      if (mutation.data.insert_moped_proj_work_activity_one) {
        handleSnackbar(true, "Work activity added", "success");
      }
    });
  };

  const handleFileAttachmentClick = useCallback(
    (id) => () => {
      setFileAttachmentId(id);
      setIsFileAttachmentDialogOpen(true);
    },
    []
  );

  const columns = useColumns({
    deleteInProgress,
    onDeleteActivity,
    setEditActivity,
    handleFileAttachmentClick,
  });

  // Open activity edit modal when double clicking in a cell
  const doubleClickListener = (params) => {
    setEditActivity(params.row);
  };

  /**
   * Initialize which columns should be visible - must be memoized to safely
   * be used with useHiddenColumnsSettings hook
   */
  const defaultHiddenColumnSettings = useMemo(
    () =>
      columns.reduce((settings, column) => {
        settings[column.field] = column.defaultVisible;
        return settings;
      }, {}),
    [columns]
  );

  const { hiddenColumns, setHiddenColumns } = useHiddenColumnsSettings({
    defaultHiddenColumnSettings,
    storageKey: "workActivityTableColumnConfig",
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <MopedDataGrid
          columns={columns}
          columnVisibilityModel={hiddenColumns}
          onColumnVisibilityModelChange={(newModel) =>
            setHiddenColumns(newModel)
          }
          localeText={{ noRowsLabel: "No work activities" }}
          initialState={{ pinnedColumns: { right: ["Edit"] } }}
          rows={activities || []}
          loading={loading || !data}
          slots={{
            toolbar: DataGridToolbar,
          }}
          slotProps={{
            toolbar: {
              title: "Work activities",
              primaryActionButton: (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={onClickAddActivity}
                >
                  Add Work Activity
                </Button>
              ),
              showColumnsButton: true,
              showFiltersButton: true,
            },
          }}
          onCellDoubleClick={doubleClickListener}
        />
      </div>
      {editActivity && (
        <ProjectWorkActivitiesDialog
          activity={editActivity}
          onClose={() => setEditActivity(null)}
          onSubmitCallback={onSubmitCallback}
          handleSnackbar={handleSnackbar}
        />
      )}
      <DeleteConfirmationModal
        type="work activity"
        submitDelete={handleDeleteConfirmed}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
        mutationPending={deleteInProgress}
      />
      {isFileAttachmentDialogOpen && (
        <ProjectWorkActivityFilesAttachmentDialog
          projectId={projectId}
          fileAttachmentId={fileAttachmentId}
          isFileAttachmentDialogOpen={isFileAttachmentDialogOpen}
          handleSnackbar={handleSnackbar}
          onClose={() => {
            setIsFileAttachmentDialogOpen(false);
            setFileAttachmentId(null);
          }}
          dataLookups={[]}
          refetch={refetch}
          rows={activities}
        />
      )}
    </>
  );
};

export default ProjectWorkActivitiesTable;
