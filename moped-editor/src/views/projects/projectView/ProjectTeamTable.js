import React from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import { CircularProgress, TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  TEAM_QUERY,
  ADD_PROJECT_PERSONNEL,
  UPDATE_PROJECT_PERSONNEL,
} from "../../../queries/project";

const ProjectTeamTable = ({
  projectState,
  setProjectState,
  projectId = null,
}) => {
  const isNewProject = projectId === null;

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });
  const [addProjectPersonnel] = useMutation(ADD_PROJECT_PERSONNEL);
  const [updateProjectPersonnel] = useMutation(UPDATE_PROJECT_PERSONNEL);

  if (loading || !data) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  // Get data from the team query payload
  const personnel = data.moped_proj_personnel;
  const users = data.moped_users;

  // Create some objects for lookups
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
  const roleIds = data.moped_project_roles.map(role => role.project_role_id);

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

  /**
   * Filter k/v pairs from an object by the key names passed in an array
   * @param {object} obj - The object with unwanted k/v pairs
   * @param {array} keys - Keys of unwanted k/v pairs
   * @return {object} New object without unneeded k/v pairs
   */
  const filterObjectByKeys = (obj, keys) =>
    Object.keys(obj)
      .filter(key => !keys.includes(key))
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: obj[key],
        }),
        {}
      );

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
      field: "role_id",
      render: personnel => roles[personnel.role_id],
      editComponent: props => (
        <Autocomplete
          id="role_id"
          name="role_id"
          options={roleIds}
          getOptionLabel={option => roles[option]}
          getOptionSelected={(option, value) => option === value}
          value={props.value}
          onChange={(event, value) => props.onChange(value)}
          renderInput={params => (
            <TextField {...params} label="Select Role" margin="normal" />
          )}
        />
      ),
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
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (isNewProject) {
                // Add personnel to state
                console.log("Add to new project");
              } else {
                // Insert personnel and associate with project
                const personnelData = {
                  ...newData,
                  project_id: projectId,
                  status_id: 1,
                };

                addProjectPersonnel({
                  variables: {
                    objects: [personnelData],
                  },
                });
              }

              setTimeout(() => refetch(), 501);
              resolve();
            }, 500);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (isNewProject) {
                // Update personnel in state
                console.log("Update in new project");
              } else {
                // Mutate personnel
                const updatedPersonnelData = {
                  ...oldData,
                  ...newData,
                };

                const cleanedPersonnelData = filterObjectByKeys(
                  updatedPersonnelData,
                  ["__typename", "tableData"]
                );

                updateProjectPersonnel({
                  variables: cleanedPersonnelData,
                });
              }

              setTimeout(() => refetch(), 501);
              resolve();
            }, 500);
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (isNewProject) {
                // Remove personnel from state
                console.log("Update in new project");
              } else {
                // Update status to inactive (0) to soft delete
                const updatedPersonnelData = { ...oldData, status_id: 0 };

                const cleanedPersonnelData = filterObjectByKeys(
                  updatedPersonnelData,
                  ["__typename", "tableData"]
                );

                updateProjectPersonnel({
                  variables: cleanedPersonnelData,
                });
              }

              setTimeout(() => refetch(), 501);
              resolve();
            }, 500);
          }),
      }}
    />
  );
};

export default ProjectTeamTable;
