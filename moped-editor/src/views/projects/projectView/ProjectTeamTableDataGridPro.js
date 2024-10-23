import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { useQuery, useMutation } from "@apollo/client";
import theme from "src/theme";

import { TEAM_QUERY } from "../../../queries/project";

const ProjectTeamTableDataGridPro = ({ projectId }) => {
  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data.moped_project_by_pk.moped_proj_personnel);

  const rows = data.moped_project_by_pk.moped_proj_personnel

  const columns = [
    { field: 'moped_user', headerName: 'Name', width: 150,
      valueGetter: (user) => {
        return user.moped_user.first_name + ' ' + user.moped_user.last_name;
      }
     },
    { field: 'moped_user', 
      headerName: 'Workgroup', 
      valueGetter: (user) => {
        console.log(user);
        return user.moped_workgroup.workgroup_name;
      },
      width: 150 },
    { 
      field: 'moped_proj_personnel_roles', 
      headerName: 'Role', 
      width: 200,
      valueGetter: (roles) => {
        if (roles.length === 0) {
          return '';
        }
        const roleNames = roles.map(role => role.moped_project_role.project_role_name);
        return roleNames.join(', ');
      }
    },
    { field: 'notes', headerName: 'Notes', width: 150 },
  ];

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        getRowId={(row) => row.project_personnel_id} // Use project_personnel_id as the unique id
        loading={loading}
        rowHeight={38}
      />
    </Box>
  );
};

export default ProjectTeamTableDataGridPro;
