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

const ProjectTeamTable = ({
  projectState,
  setProjectState,
  projectId = null,
}) => {
  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  if (loading || !data) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  // Get data from the team query payload
  const personnel = data.moped_proj_personnel;
  const users = data.moped_users;
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

  /**
   * Get a user object from the users array
   * @param {number} id - User id from the moped project personnel row
   * @return {object} Object containing user data
   */
  const getUserById = id => users.find(user => user.user_id === id);

  /**
   * Get personnel name from their user ID
   * @param {number} id - User id from the moped project personnel row
   * @return {string} Full name of user
   */
  const getPersonnelName = id => {
    const user = getUserById(id);
    return `${user.first_name} ${user.last_name}`;
  };

  /**
   * Get personnel workgroup from their user ID
   * @param {number} id - User id from the moped project personnel row
   * @return {string} Workgroup name of the user
   */
  const getPersonnelWorkgroup = id => {
    const user = getUserById(id);
    return workgroups[user.workgroup_id];
  };

  const handleNoteChange = value => {
    console.log("handler", value);
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      render: personnel => getPersonnelName(personnel.user_id),
    },
    {
      title: "Workgroup",
      render: personnel => getPersonnelWorkgroup(personnel.user_id),
    },
    {
      title: "Role",
      render: personnel => roles[personnel.role_id],
    },
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
          helperText="125 character max"
          value={""}
          onChange={e => handleNoteChange(e.target.value)}
        />
      ),
    },
  ];

  return (
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
              console.log("new data", newData);
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
  );
};

export default ProjectTeamTable;
