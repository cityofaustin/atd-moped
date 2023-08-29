import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  CircularProgress,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DataGrid } from "@mui/x-data-grid";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectWorkActivitiesDialog from "./ProjectWorkActivitiesDialog";
import { getUserFullName } from "src/utils/userNames";
import {
  WORK_ACTIVITY_QUERY,
  DELETE_WORK_ACTIVITY,
} from "../../../queries/funding";
import { currencyFormatter } from "src/utils/numberFormatters";

const Title = ({ onClick }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="h2" color="primary" style={{ padding: "1em" }}>
      Work activities
    </Typography>
    <div style={{ padding: "1rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={onClick}
      >
        Add Work Activity
      </Button>
    </div>
  </Box>
);

const ProjectWorkActivitiesTable = () => {
  const [editActivity, setEditActivity] = useState(null);
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(WORK_ACTIVITY_QUERY, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  // const [addContract] = useMutation(ADD_CONTRACT);
  const [deleteContract, deleteContractMutationState] =
    useMutation(DELETE_WORK_ACTIVITY);

  if (loading || !data) return <CircularProgress />;

  const activities = data?.moped_proj_work_activity;

  const onClickAddActivity = () => setEditActivity({ project_id: projectId });

  const onDeleteActivity = ({ id }) => {
    window.confirm("Are you sure you want to delete this activity?") &&
      deleteContract({ variables: { id } }).then(() => {
        refetch();
      });
  };

  const columns = [
    {
      headerName: "",
      field: "__edit__",
      renderCell: ({ row }) => {
        return deleteContractMutationState?.loading ? (
          <CircularProgress color="primary" size={20} />
        ) : (
          <div>
            <IconButton aria-label="edit" onClick={() => setEditActivity(row)}>
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
      headerName: "Workgroup/Contractor",
      field: "contractor",
      minWidth: 175,
    },
    {
      headerName: "Contract #",
      field: "contract_number",
      minWidth: 150,
    },
    // {
    //   headerName: "Imp. Workgroup",
    //   field: "implementation_workgroup",
    //   minWidth: 150,
    // },
    {
      headerName: "Work Assignment",
      field: "work_assignment_id",
      minWidth: 150,
    },
    {
      headerName: "Amount",
      field: "contract_amount",
      minWidth: 150,
      valueGetter: ({ row }) =>
        isNaN(parseInt(row.contract_amount))
          ? null
          : currencyFormatter.format(row.contract_amount),
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
      headerName: "Status",
      field: "status",
      valueGetter: ({ row }) => row.moped_work_activity_status?.name,
      minWidth: 150,
    },
    {
      headerName: "Description",
      field: "description",
      minWidth: 150,
    },
    {
      headerName: "Status update",
      field: "status_note",
      minWidth: 150,
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
    {
      headerName: "ID",
      field: "id",
      minWidth: 50,
    },
  ];

  const onSubmitCallback = () => {
    refetch().then(() => setEditActivity(null));
  };

  console.log("AC", activities);
  return (
    <ApolloErrorHandler errors={error}>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          autoHeight
          columns={columns}
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          hideFooterPagination={true}
          localeText={{ noRowsLabel: "No work activites" }}
          rows={activities}
          slots={{
            toolbar: Title,
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
