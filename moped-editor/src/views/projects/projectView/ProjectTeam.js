import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

// Material
import { CardContent, CircularProgress, Grid } from "@material-ui/core";
import MaterialTable from "material-table";

import { TEAM_QUERY } from "../../../queries/project";

const ProjectTeam = () => {
  const { projectId } = useParams();

  const { loading, error, data } = useQuery(TEAM_QUERY, {
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
  );
};

export default ProjectTeam;
