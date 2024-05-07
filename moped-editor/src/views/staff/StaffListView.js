import React from "react";

import { Box, Card, Container, CircularProgress } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro";

import Page from "src/components/Page";
import { GET_ALL_USERS } from "src/queries/staff";
import {
  AddUserButton,
  EditUserButton,
  CopyMugUsersButton,
} from "./StaffListViewCustomComponents";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  container: {
    maxWidth: "100%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
}));

const staffColumns = [
  {
    headerName: "",
    field: "user_id",
    renderCell: (props) => <EditUserButton id={props.value} />,
    width: 50,
    sortable: false,
    filterable: false,
  },
  {
    headerName: "First name",
    field: "first_name",
    width: 125,
  },
  {
    headerName: "Last name",
    field: "last_name",
    width: 125,
  },
  {
    headerName: "E-mail",
    field: "email",
    width: 200,
  },
  {
    headerName: "Title",
    field: "title",
    width: 250,
  },
  {
    headerName: "Workgroup",
    field: "moped_workgroup",
    valueGetter: (value) => value.workgroup_name,
    width: 300,
  },
  {
    headerName: "Role",
    field: "roles",
    valueGetter: value => {
      if (!value || !value[0]) {
        return "N/A";
      }
      const role = value[0].replace("moped-", "");
      return role.charAt(0).toUpperCase() + role.slice(1);
    },
    width: 125,
  },
  {
    headerName: "MUG Member",
    field: "is_user_group_member",
    valueGetter: (props) => (props.value ? "Yes" : "No"),
  },
  {
    headerName: "Active",
    field: "is_deleted",
    // if the user has been deleted (is_deleted === True), then they are not active
    valueGetter: (value) => (value ? "No" : "Yes"),
  },
  {
    headerName: "Last seen",
    field: "last_seen_date",
    type: "date",
    valueGetter: (value) => (value ? new Date(value) : null),
    width: 200,
  },
];

const StaffListView = () => {
  const classes = useStyles();

  const { data, loading, error } = useQuery(GET_ALL_USERS);

  if (error) {
    console.error(error);
  }

  return (
    <Page className={classes.root} title="Staff">
      {loading ? (
        <CircularProgress />
      ) : (
        <Container className={classes.container}>
          <Box className={classes.buttonContainer}>
            <CopyMugUsersButton users={data?.moped_users} />
            <AddUserButton />
          </Box>
          <Card>
            <DataGridPro
              sx={dataGridProStyleOverrides}
              disableRowSelectionOnClick
              rows={data?.moped_users}
              columns={staffColumns}
              getRowId={(row) => row.user_id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Container>
      )}
    </Page>
  );
};

export default StaffListView;
