import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

// Material
import {
  CardContent,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";
import MaterialTable from "material-table";

import { TEAM_QUERY } from "../../../queries/project";

const ProjectTeam = () => {
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  if (loading || !data) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const personnel = data.moped_proj_personnel;
  const workgroups = data.moped_workgroup.reduce(
    (acc, workgroup) => ({
      ...acc,
      [workgroup.workgroup_id]: workgroup.workgroup_name,
    }),
    {}
  );
  const roles = data.moped_project_roles.reduce(
    (acc, role) => ({
      ...acc,
      [role.project_role_id]: role.project_role_name,
    }),
    {}
  );
  const users = data.moped_users;

  console.log(personnel, workgroups, users);

  const getUserById = id => users.find(user => user.user_id === id);

  const getPersonnelName = id => {
    const user = getUserById(id);
    return `${user.first_name} ${user.last_name}`;
  };

  const getPersonnelWorkgroup = id => {
    const user = getUserById(id);
    return workgroups[user.workgroup_id];
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    // This can come from the user table
    {
      title: "Name",
      render: personnel => getPersonnelName(personnel.user_id),
    },
    // This can come come from the user table
    {
      title: "Workgroup",
      render: personnel => getPersonnelWorkgroup(personnel.user_id),
    },
    // This is saved in the personnel table
    {
      title: "Role",
      render: personnel => roles[personnel.role_id],
    },
    // This is saved in the personnel table
    {
      title: "Notes",
      field: "notes",
      editComponent: props => (
        <TextField
          name="Notes"
          style={{ width: 250, paddingLeft: 10 }}
          multiline
          inputProps={{ maxLength: 125 }}
          variant="outlined"
          helperText="75 character max"
          value={""}
          // onChange={e => handleNoteChange(e.target.value, index)}
        />
      ),
    },
  ];

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <div style={{ maxWidth: "100%" }}> */}
          <MaterialTable
            columns={columns}
            data={personnel}
            title="Project Team"
            options={{
              search: false,
            }}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    // Add team member

                    setTimeout(() => refetch(), 501);
                    resolve();
                  }, 500);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    // Update team member

                    setTimeout(() => refetch(), 501);
                    resolve();
                  }, 500);
                }),
              // onRowDelete: oldData =>
              //   new Promise((resolve, reject) => {
              //     setTimeout(() => {
              //       // Execute delete mutation

              //       setTimeout(() => refetch(), 501);
              //       resolve();
              //     }, 500);
              //   }),
            }}
          />
          {/* </div> */}
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
