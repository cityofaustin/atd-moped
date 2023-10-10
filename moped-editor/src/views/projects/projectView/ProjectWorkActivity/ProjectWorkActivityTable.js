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
import OpenInNew from "@mui/icons-material/OpenInNew";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import WorkActivityToolbar from "./ProjectWorkActivityToolbar";
import ProjectWorkActivitiesDialog from "./ProjectWorkActivityDialog";
import { getUserFullName } from "src/utils/userNames";
import {
  WORK_ACTIVITY_QUERY,
  DELETE_WORK_ACTIVITY,
} from "../../../../queries/funding";
import { currencyFormatter } from "src/utils/numberFormatters";

/** Hook that provides memoized column settings */
const useColumns = ({ deleteInProgress, onDeleteActivity, setEditActivity }) =>
  useMemo(() => {
    return [
      {
        headerName: "",
        field: "_edit",
        hideable: false,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return deleteInProgress ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            <div>
              <IconButton
                aria-label="edit"
                onClick={() => setEditActivity(row)}
              >
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
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
        minWidth: 50,
      },
      {
        headerName: "Workgroup/Contractor",
        field: "contractor",
        minWidth: 175,
      },
      {
        headerName: "Contract #",
        field: "contract_number",
        minWidth: 150,
      },
      {
        headerName: "Work Assignment",
        field: "work_assignment_id",
        minWidth: 150,
      },
      {
        headerName: "Status",
        field: "status",
        valueGetter: ({ row }) => row.moped_work_activity_status?.name,
        minWidth: 150,
      },
      {
        headerName: "Task Order(s)",
        field: "task_orders",
        valueGetter: ({ row }) =>
          row.task_orders?.map((tk) => tk.task_order).join(", "),
        minWidth: 150,
        renderCell: ({ row }) => (
          <div>
            {row.task_orders?.map((tk) => (
              <div key={tk.task_order}>{tk.task_order}</div>
            ))}
          </div>
        ),
      },
      {
        headerName: "Description",
        field: "description",
        minWidth: 150,
      },
      {
        headerName: "Amount",
        field: "contract_amount",
        minWidth: 50,
        valueGetter: ({ row }) =>
          isNaN(parseInt(row.contract_amount))
            ? null
            : currencyFormatter.format(row.contract_amount),
      },
      {
        headerName: "Status update",
        field: "status_note",
        minWidth: 150,
      },
      {
        headerName: "Work Order Link",
        field: "work_order_url",
        minWidth: 150,
        renderCell: ({ row }) =>
          row.work_order_url ? (
            <Link href={row.work_order_url} target={"_blank"}>
              {row.work_order_url}
              <OpenInNew sx={{ fontSize: "1rem" }} />
            </Link>
          ) : null,
      },
      {
        headerName: "Updated by",
        field: "updated_by_user",
        minWidth: 150,
        valueGetter: ({ row }) => getUserFullName(row.updated_by_user),
      },
      {
        headerName: "Updated at",
        field: "updated_at",
        minWidth: 150,
        valueGetter: ({ row }) =>
          row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "",
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

  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler errors={error}>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          autoHeight
          columns={columns}
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
