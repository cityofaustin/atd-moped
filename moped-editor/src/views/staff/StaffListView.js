import React, { useState } from "react";

import {
  Card,
  FormControlLabel,
  FormGroup,
  Switch,
  CircularProgress,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import Page from "src/components/Page";
import { NavLink as RouterLink } from "react-router-dom";

import { StaffListViewQueryConf } from "./StaffListViewQueryConf";
import GQLAbstract from "../../libs/GQLAbstract";
import GridTable from "../../components/GridTable/GridTable";
import { GET_ALL_USERS } from "src/queries/staff";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  switch: {
    marginTop: "1rem",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
}));

const StaffListView = () => {
  const classes = useStyles();

  const [showInactive, setShowInactive] = useState(false);

  /**
   * Override 'where' key based on state of 'showInactive'
   * @type {GQLAbstract}
   */
  const staffQuery = new GQLAbstract({
    ...StaffListViewQueryConf,
    ...(showInactive ? { where: {} } : {}),
  });

  const { data, loading, error } = useQuery(GET_ALL_USERS);

  /**
   * Toggles list of inactive users
   */
  const toggleShowInactive = () => {
    setShowInactive(!showInactive);
  };

  const staffColumns = [
    {
      headerName: "",
      field: "user_id",
      renderCell: (props) => (
        <RouterLink to={`edit/${props.value}`}>
          <CreateOutlinedIcon color="primary" />{" "}
        </RouterLink>
      ),
      width: 50,
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
      width: 325,
    },
    {
      headerName: "Title",
      field: "title",
      width: 250,
    },
    {
      headerName: "Workgroup",
      field: "moped_workgroup",
      valueGetter: (props) => props.row.moped_workgroup.workgroup_name,
      width: 300,
    },
    {
      headerName: "Role",
      field: "roles",
      renderCell: (props) => {
        if (!props.value || !props.value[0]) {
          return "N/A";
        }

        const role = props.value[0].replace("moped-", "");
        return role.charAt(0).toUpperCase() + role.slice(1);
      },
    },
  ];

  if (error) {
    console.error(error);
  }

  return (
    <Page className={classes.root} title="Staff">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <GridTable
            title={"Staff"}
            query={staffQuery}
            toolbar={null}
            customComponents={{
              table: {
                before: (
                  <FormGroup className={classes.switch}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showInactive}
                          onChange={toggleShowInactive}
                          color={"primary"}
                        />
                      }
                      labelPlacement="start"
                      label="Show Inactive Accounts"
                    />
                  </FormGroup>
                ),
              },
            }}
          />
          <Card>
            <DataGrid
              rows={data["moped_users"]}
              columns={staffColumns}
              getRowId={(row) => row.user_id}
              slots={{ toolbar: GridToolbar }}
            />
          </Card>
        </>
      )}
    </Page>
  );
};

export default StaffListView;
