import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CircularProgress, IconButton, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DataGrid } from "@mui/x-data-grid";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectWorkActivitiesDialog from "./ProjectWorkActivitiesDialog";

import { WORK_ACTIVITY_QUERY } from "../../../queries/funding";

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
  // const [deleteContract] = useMutation(DELETE_CONTRACT);

  if (loading || !data) return <CircularProgress />;

  const stuff = data?.moped_proj_work_activity;

  const columns = [
    {
      headerName: "",
      field: "__edit__",
      renderCell: ({ row }) => (
        <IconButton aria-label="edit" onClick={() => setEditActivity(row)}>
          <EditOutlinedIcon />
        </IconButton>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      valueGetter: ({ row }) => row.moped_work_activity_status?.name,
      minWidth: 150,
    },
    {
      headerName: "Contract #",
      field: "contract_number",
      minWidth: 150,
    },
    {
      headerName: "Contractor",
      field: "contractor",
      minWidth: 150,
    },
    {
      headerName: "Imp. Workgroup",
      field: "implementation_workgroup",
      minWidth: 150,
    },
    {
      headerName: "Work Assignment",
      field: "work_assignment_id",
      minWidth: 150,
    },
    {
      headerName: "Amount",
      field: "amount",
      minWidth: 150,
    },
    {
      headerName: "Task Order(s)",
      field: "task_orders",
      valueGetter: ({ row }) =>
        row.task_orders?.map((tk) => tk.task_order).join(", "),
      minWidth: 150,
    },
    {
      headerName: "Description",
      field: "description",
      minWidth: 150,
      valueGetter: ({ row }) =>
        "helloooooooooooooooo helloooooooooooooooo helloooooooooooooooo",
    },
    {
      headerName: "ID",
      field: "id",
      minWidth: 300,
    },
  ];

  const onSubmitCallback = (data) => {
    refetch().then(() => setEditActivity(null));
  };

  return (
    <ApolloErrorHandler errors={error}>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          hideFooterPagination={true}
          autoHeight
          disableRowSelectionOnClick
          rows={stuff}
          columns={columns}
          // slots={{ toolbar: GridToolbar }}
          // slotProps={{ toolbar: { showQuickFilter: true } }}
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
