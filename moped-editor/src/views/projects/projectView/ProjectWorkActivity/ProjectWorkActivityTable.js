import { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
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
        minWidth: 125,
        flex: 1,
        defaultVisible: true,
      },
      {
        headerName: "Workgroup/Contractor",
        field: "workgroup_contractor",
        minWidth: 175,
        flex: 1,
        defaultVisible: true,
      },
      {
        headerName: "Contract #",
        field: "contract_number",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
      },
      {
        headerName: "Description",
        field: "description",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
      },
      {
        headerName: "Work Assignment",
        field: "work_assignment_id",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
      },
      {
        headerName: "Task Order(s)",
        field: "task_orders",
        defaultVisible: true,
        minWidth: 150,
        flex: 1,
        valueGetter: ({ row }) =>
          row.task_orders?.map((tk) => tk.task_order).join(", "),
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
        minWidth: 150,
        flex: 1,
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
        field: "status",
        defaultVisible: true,
        valueGetter: ({ row }) => row.moped_work_activity_status?.name,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "Amount",
        field: "contract_amount",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
        valueGetter: ({ row }) =>
          isNaN(parseInt(row.contract_amount))
            ? null
            : currencyFormatter.format(row.contract_amount),
      },
      {
        headerName: "Status update",
        field: "status_note",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
      },
      {
        headerName: "Updated by",
        field: "updated_by_user",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
        valueGetter: ({ row }) => getUserFullName(row.updated_by_user),
      },
      {
        headerName: "Updated at",
        field: "updated_at",
        minWidth: 150,
        flex: 1,
        defaultVisible: true,
        type: "date",
        valueGetter: ({ value }) => (value ? new Date(value) : null),
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
        <DataGrid
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
          hideFooterPagination={true}
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
