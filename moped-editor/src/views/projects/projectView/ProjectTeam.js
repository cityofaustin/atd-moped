import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import MaterialTable from "material-table";

import { CardContent, Grid, CircularProgress } from "@material-ui/core";
import { TEAM_QUERY } from "../../../queries/project";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

const ProjectTeam = () => {
  const { projectId } = useParams();

  const { loading, error, data } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  if (loading || !data) return <CircularProgress />;

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
    },
  ];

  return (
    <ApolloErrorHandler error={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MaterialTable
              columns={columns}
              data={personnel}
              title="Project Team"
              options={{
                search: false,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectTeam;
