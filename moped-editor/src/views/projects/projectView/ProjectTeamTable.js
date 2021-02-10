import React from "react";
import { useQuery } from "@apollo/client";

// Material
import { CircularProgress, TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

  // Options for Autocomplete form elements
  const userIds = users.map(user => user.user_id);

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
      field: "user_id",
      render: personnel => getPersonnelName(personnel.user_id),
      editComponent: props => (
        <Autocomplete
          id="user_id"
          name="user_id"
          options={userIds}
          getOptionLabel={option => getPersonnelName(option)}
          getOptionSelected={(option, value) => option === value}
          value={props.value}
          onChange={(event, value) => props.onChange(value)}
          renderInput={params => (
            <TextField {...params} label="Select Staff" margin="normal" />
          )}
        />
      ),
    },
    {
      title: "Workgroup",
      render: personnel => getPersonnelWorkgroup(personnel.user_id),
    },
    {
      title: "Role",
      field: "role",
      render: personnel => roles[personnel.role_id],
    },
    {
      title: "Notes",
      field: "notes",
      editComponent: props => (
        <TextField
          id="notes"
          name="notes"
          multiline
          inputProps={{ maxLength: 125 }}
          variant="outlined"
          helperText="125 character max"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
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
        // onRowAdd: newData =>
        //   new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //       // Add team member
        //       console.log("new data", newData);
        //       setTimeout(() => refetch(), 501);
        //       resolve();
        //     }, 500);
        //   }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              // Update team member
              console.log(newData, oldData);
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
