import * as React from 'react';
import { useState, useMemo } from "react";
import { Box, Icon, Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { DataGridPro, GridRowModes, GridActionsCellItem, useGridApiContext } from '@mui/x-data-grid-pro';
import { useQuery, useMutation } from "@apollo/client";
import theme from "src/theme";
import { 
  TEAM_QUERY, 
  UPDATE_PROJECT_PERSONNEL, 
  INSERT_PROJECT_PERSONNEL, 
  DELETE_PROJECT_PERSONNEL 
} from "src/queries/project";
import dataGridProStyleOverrides from 'src/styles/dataGridProStylesOverrides';
import ProjectTeamToolbar from './ProjectTeamToolbar';

import { EditOutlined as EditOutlinedIcon, DeleteOutline as DeleteOutlineIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import { defaultEditColumnIconStyle } from 'src/styles/dataGridProStylesOverrides';

const useStyles = makeStyles((theme) => ({
  infoIcon: {
    fontSize: "1.25rem",
    verticalAlign: "sub",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

const ProjectTeamTableDataGridPro = ({ projectId }) => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });


  const [editTeamMember, setEditTeamMember] = useState(null);
  const [deleteTeamMember, { loading: deleteInProgress }] = useMutation(DELETE_PROJECT_PERSONNEL);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  console.log(data.moped_project_by_pk.moped_proj_personnel);

  // Set the rows but add the workgroup name to the row data 
  // instead of being nested under moped_user.
  const rows = data.moped_project_by_pk.moped_proj_personnel.map(personnel => ({
    ...personnel,
    moped_workgroup: personnel.moped_user.moped_workgroup
  }));

  const onClickAddTeamMember = () => {
    console.log('add team member'); 
    return setEditTeamMember({ project_id: projectId });
  }

  const onClickEditTeamMember = (projectPersonnelId) => {
    console.log('edit team member', projectPersonnelId);
    return setEditTeamMember({ project_personnel_id: projectPersonnelId });
  }

  const useColumns = ({
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
  }) => 
    useMemo(() => {
      return [
    { 
      field: 'moped_user', 
      headerName: 'Name', 
      width: 150,
      valueGetter: (user) => {
        return user ? `${user.first_name} ${user.last_name}` : '';
      }
     },
    { 
      field: 'moped_workgroup',
      headerName: 'Workgroup', 
      valueGetter: (workgroup) => workgroup?.workgroup_name,
      width: 150 
    },
    { 
      field: 'moped_proj_personnel_roles', 
      headerName: 'Role',
      renderHeader: () => (
        <span>
          Role{" "}
          <Link
            href="https://atd-dts.gitbook.io/moped/user-guides/project-team"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className={classes.infoIcon}>info_outline</Icon>
          </Link>
        </span>
      ),
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
    { 
      headerName: '', 
      field: 'edit', 
      hideable: false,
      filterable: false,
      sortable: false,
      editable: false,
      type: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CheckIcon sx={defaultEditColumnIconStyle} />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CloseIcon sx={defaultEditColumnIconStyle} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditOutlinedIcon sx={defaultEditColumnIconStyle} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutlineIcon sx={defaultEditColumnIconStyle} />}
            label="Delete"
            onClick={() => handleDeleteOpen(id)}
            color="inherit"
          />,
        ];
      },
    }
      ]
    },
    [rowModesModel, handleEditClick, handleSaveClick, handleCancelClick, handleDeleteOpen]
  );

  const dataGridColumns = useColumns({
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        autoHeight
        columns={dataGridColumns}
        rows={rows}
        density="comfortable"
        getRowId={(row) => row.project_personnel_id} // Use project_personnel_id as the unique id
        disableRowSelectionOnClick
        disableColumnMenu
        getRowHeight={() => 'auto'}
        hideFooter
        localeText={{ noRowsLabel: 'No team members found' }}
        loading={loading}
        slots={{
          toolbar: ProjectTeamToolbar,
        }}
        slotProps={{
          toolbar: {
            addAction: onClickAddTeamMember,
          },
        }}
      />
    </Box>
  );
};

export default ProjectTeamTableDataGridPro;
