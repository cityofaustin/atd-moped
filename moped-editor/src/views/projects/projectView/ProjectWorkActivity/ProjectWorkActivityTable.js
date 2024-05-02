import { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGridPro } from "@mui/x-data-grid-pro";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import WorkActivityToolbar from "./ProjectWorkActivityToolbar";
import ProjectWorkActivitiesDialog from "./ProjectWorkActivityDialog";
import { getUserFullName } from "src/utils/userNames";
import {
  WORK_ACTIVITY_QUERY,
  DELETE_WORK_ACTIVITY,
} from "../../../../queries/funding";
import { currencyFormatter } from "src/utils/numberFormatters";
import { useHiddenColumnsSettings } from "src/utils/localStorageHelpers";

/** Hook that provides memoized column settings */
const useColumns = ({ deleteInProgress, onDeleteActivity, setEditActivity }) =>
  useMemo(() => {
    return [
      {
        headerName: "",
        field: "Edit",
        hideable: false,
        filterable: false,
        sortable: false,
        defaultVisible: true,
        renderCell: ({ row }) => {
          return deleteInProgress ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            <div>
              <IconButton
                aria-label="edit"
                sx={{ color: "inherit" }}
                onClick={() => setEditActivity(row)}
              >
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                sx={{ color: "inherit" }}
                onClick={() => onDeleteActivity({ id: row.id })}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        },
      },
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
        width: 150,
        valueGetter: (field) => field?.map((tk) => tk.task_order).join(", "),
        renderCell: ({ row }) => (
          <div>
            {row.task_orders?.map((tk) => (
              <div key={tk.task_order}>{tk.task_order}</div>
            ))}
          </div>
        ),
      },
      {
        headerName: "Work Order Link",
        field: "work_order_url",
        width: 150,
        defaultVisible: true,
        renderCell: ({ row }) =>
          row.work_order_url ? (
            <Link
              href={row.work_order_url}
              target={"_blank"}
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {row.work_order_url}
            </Link>
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
        type: "date",
        valueGetter: (field) => (field ? new Date(field) : null),
      },
    ];
  }, [deleteInProgress, onDeleteActivity, setEditActivity]);

const ProjectWorkActivitiesTable = () => {
  const [editActivity, setEditActivity] = useState(null);
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(WORK_ACTIVITY_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  const [deleteContract, { loading: deleteInProgress }] =
    useMutation(DELETE_WORK_ACTIVITY);

  const activities = data?.moped_proj_work_activity;

  const onClickAddActivity = () => setEditActivity({ project_id: projectId });

  const onDeleteActivity = useCallback(
    ({ id }) => {
      window.confirm("Are you sure you want to delete this activity?") &&
        deleteContract({ variables: { id } }).then(() => {
          refetch();
        });
    },
    [deleteContract, refetch]
  );

  const onSubmitCallback = () => {
    refetch().then(() => setEditActivity(null));
  };

  const columns = useColumns({
    deleteInProgress,
    onDeleteActivity,
    setEditActivity,
  });

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

  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler errors={error}>
      <Box sx={{ width: "100%", overflow: "auto", minHeight: "700px" }}>
        <DataGridPro
          sx={{
            "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
              py: "8px",
            },
            "&.MuiDataGrid-root": {
              "--DataGrid-containerBackground": "#fff",
              "--DataGrid-pinnedBackground": "#fff",
            },
          }}
          autoHeight
          columns={columns}
          columnVisibilityModel={hiddenColumns}
          onColumnVisibilityModelChange={(newModel) =>
            setHiddenColumns(newModel)
          }
          toolbar
          density="comfortable"
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          hideFooter
          localeText={{ noRowsLabel: "No work activites" }}
          rows={activities}
          slots={{
            toolbar: WorkActivityToolbar,
          }}
          slotProps={{
            toolbar: { onClick: onClickAddActivity },
          }}
        />
      </Box>
      {editActivity && (
        <ProjectWorkActivitiesDialog
          activity={editActivity}
          onClose={() => setEditActivity(null)}
          onSubmitCallback={onSubmitCallback}
        />
      )}
    </ApolloErrorHandler>
  );
};

export default ProjectWorkActivitiesTable;
