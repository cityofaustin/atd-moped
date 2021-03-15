import React from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import { CircularProgress, TextField, Typography } from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import MaterialTable, { MTableEditRow } from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import typography from "../../../theme/typography";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  TEAM_QUERY,
  ADD_PROJECT_PERSONNEL,
  UPDATE_PROJECT_PERSONNEL,
} from "../../../queries/project";

const ProjectTeamTable = ({
  personnelState,
  setPersonnelState,
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
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "user_id",
      render: personnel => getPersonnelName(personnel.user_id),
      validate: rowData => !!rowData.user_id,
      editComponent: props => (
        <Autocomplete
          id="user_id"
          name="user_id"
          options={userIds}
          getOptionLabel={option => getPersonnelName(option)}
          getOptionSelected={(option, value) => option === value}
          value={props.value}
          onChange={(event, value) => props.onChange(value)}
          renderInput={params => <TextField {...params} />}
        />
      ),
    },
    {
      title: "Workgroup",
      render: personnel => (
        <Typography>{getPersonnelWorkgroup(personnel.user_id)}</Typography>
      ),
    },
    {
      title: "Role",
      field: "role_id",
      render: personnel => roles[personnel.role_id],
      validate: rowData => !!rowData.role_id,
      editComponent: props => (
        <Autocomplete
          id="role_id"
          name="role_id"
          options={roleIds}
          getOptionLabel={option => roles[option]}
          getOptionSelected={(option, value) => option === value}
          value={props.value}
          onChange={(event, value) => props.onChange(value)}
          renderInput={params => <TextField {...params} />}
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
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
  ];

  /**
   * Data handlers for editable actions based on isNewProject boolean <MaterialTable>
   */
  const isNewProjectActions = {
    true: {
      add: newData => {
        const activePersonnel = { ...newData, status_id: 1 };

        setPersonnelState([...personnelState, activePersonnel]);
      },
      update: (newData, oldData) => {
        const dataUpdate = [...personnelState];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setPersonnelState([...dataUpdate]);
      },
      delete: oldData => {
        const dataDelete = [...personnelState];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setPersonnelState([...dataDelete]);
      },
    },
    false: {
      add: newData => {
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
      },
      update: (newData, oldData) => {
        const updatedPersonnelData = {
          ...oldData,
          ...newData,
        };

        const cleanedPersonnelData = filterObjectByKeys(updatedPersonnelData, [
          "__typename",
          "tableData",
        ]);

        updateProjectPersonnel({
          variables: cleanedPersonnelData,
        });
      },
      delete: oldData => {
        const updatedPersonnelData = { ...oldData, status_id: 0 };

        const cleanedPersonnelData = filterObjectByKeys(updatedPersonnelData, [
          "__typename",
          "tableData",
        ]);

        updateProjectPersonnel({
          variables: cleanedPersonnelData,
        });
      },
    },
  };

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
        components={{
          EditRow: (props, rowData) => <MTableEditRow {...props} onKeyDown={(e) => {
              if (e.keyCode === 13) {
                // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
              }
          }} />
        }}
        data={isNewProject ? personnelState : personnel}
        title="Project team"
        options={{
          search: false,
          rowStyle: { fontFamily: typography.fontFamily },
        }}
        icons={{ Delete: ClearIcon }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].add(newData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].update(newData, oldData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].delete(oldData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
        }}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectTeamTable;
