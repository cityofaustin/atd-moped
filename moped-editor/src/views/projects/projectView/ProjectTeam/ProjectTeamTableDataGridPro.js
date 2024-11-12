import * as React from 'react';
import { useState, useMemo, useEffect, useCallback } from "react";
import isEqual from "lodash/isEqual";
import { Box, Icon, Link, CircularProgress, TextField, Autocomplete } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { DataGridPro, GridRowModes, GridActionsCellItem, useGridApiRef } from '@mui/x-data-grid-pro';
import { useQuery, useMutation } from "@apollo/client";
import theme from "src/theme";
import { defaultEditColumnIconStyle } from "src/utils/dataGridHelpers";
import { 
  TEAM_QUERY, 
  UPDATE_PROJECT_PERSONNEL, 
  INSERT_PROJECT_PERSONNEL, 
  DELETE_PROJECT_PERSONNEL 
} from "src/queries/project";
import dataGridProStyleOverrides from 'src/styles/dataGridProStylesOverrides';
import ProjectTeamToolbar from './ProjectTeamToolbar';
import ProjectTeamRoleMultiselect from './ProjectTeamRoleMultiselect';

import { EditOutlined as EditOutlinedIcon, DeleteOutline as DeleteOutlineIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import { useUser } from 'src/auth/user';

import LookupAutocompleteComponent from 'src/components/DataGridPro/LookupAutocompleteComponent';
import TeamAutocompleteComponent from './TeamAutocompleteComponent';
import DataGridTextField from 'src/components/DataGridPro/DataGridTextField';
import ApolloErrorHandler from 'src/components/ApolloErrorHandler';

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

const useTeamNameLookup = (data) => 
  useMemo(() => {
    if (!data) {
      return {};
    }
    return data.moped_users.reduce((obj, item) => {
      obj[item.user_id] = `${item.first_name} ${item.last_name}`;
      return obj;
    }, {});
  }, [data]);

const useRoleNameLookup = (data) => 
  useMemo(() => {
    if (!data) {
      return {};
    }
    return data.moped_project_roles.reduce((obj, item) => {
      obj[item.project_role_id] = item.project_role_name;
      return obj;
    }, {});
  }, [data]);

const useColumns = ({
  data,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  handleDeleteOpen,
  classes,
  teamNameLookup,
  roleNameLookup
}) => 
  useMemo(() => {
    return [
  { 
    headerName: 'Name', 
    field: 'moped_user', 
    width: 200,
    editable: true,
    valueGetter: (user) => {
      return user ? `${user.first_name} ${user.last_name}` : '';
    },
    renderEditCell: (props) => (
      <TeamAutocompleteComponent
        {...props}
        name={"user"}
        nameLookup={teamNameLookup}
      />
    )
    },
  { 
    headerName: 'Workgroup', 
    field: 'moped_workgroup',
    width: 200,
    valueGetter: (workgroup) => workgroup?.workgroup_name,
  },
  { 
    headerName: 'Role',
    field: 'moped_proj_personnel_roles', 
    width: 200,
    editable: true,
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
    valueGetter: (params) => {
      const roles = params.value || [];
      // Add null check and filter out deleted roles
      if (!Array.isArray(roles)) return '';
      
      const activeRoles = roles.filter(role => !role.is_deleted);
      if (activeRoles.length === 0) return '';
      
      return activeRoles
        .map(role => role.moped_project_role?.project_role_name)
        .filter(Boolean) // Remove any undefined values
        .join(', ');
    },
    renderEditCell: (props) => {
      console.log('render edit cell', props);
      return (
        <ProjectTeamRoleMultiselect
          {...props}
          value={props.row.roleIds || []}
          roles={data.moped_project_roles}
        />
      );
    }
  },
  { 
    headerName: 'Notes', 
    field: 'notes', 
    width: 200, 
    editable: true, 
    renderEditCell: (props) => <DataGridTextField {...props} /> 
  },
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
            onClick={handleCancelClick(id, 'project_personnel_id')}
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
  [
    data, 
    rowModesModel, 
    handleEditClick, 
    handleSaveClick, 
    handleCancelClick, 
    handleDeleteOpen,
    classes,
    teamNameLookup,
    roleNameLookup
  ]
);

const ProjectTeamTableDataGridPro = ({ projectId }) => {
  const apiRef = useGridApiRef();
  const classes = useStyles();
  const { user } = useUser();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const [addProjectPersonnel] = useMutation(INSERT_PROJECT_PERSONNEL);
  const [updateProjectPersonnel] = useMutation(UPDATE_PROJECT_PERSONNEL);
  const [deleteProjectPersonnel] = useMutation(DELETE_PROJECT_PERSONNEL);

  const [editTeamMember, setEditTeamMember] = useState(null);
  const [deleteTeamMemberId, setDeleteTeamMemberId] = useState(null);

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    if (data?.moped_project_by_pk?.moped_proj_personnel?.length > 0) {
      // Set the rows but add the workgroup name to the row data 
      // instead of being nested under moped_user.
      setRows(data.moped_project_by_pk.moped_proj_personnel.map(personnel => ({
        ...personnel,
        moped_workgroup: personnel.moped_user.moped_workgroup
      })));
    } else {
      setRows([]); // Reset rows when no data is available
    }
  }, [data]);

  const teamNameLookup = useTeamNameLookup(data);
  const roleNameLookup = useRoleNameLookup(data);
  const onClickAddTeamMember = () => {
    console.log('add team member'); 
    return setEditTeamMember({ project_id: projectId });
  }

  const onClickEditTeamMember = (projectPersonnelId) => {
    console.log('edit team member', projectPersonnelId);
    return setEditTeamMember({ project_personnel_id: projectPersonnelId });
  }

  const handleEditClick = useCallback((id) => () => {
    console.log('edit click', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  }, [rowModesModel]);

  const handleSaveClick = useCallback((id) => () => {
    console.log('save click', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  }, [rowModesModel]);

  const handleCancelClick = (id, tableId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row[tableId] === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteOpen = useCallback((id) => {
    console.log('delete open', id);
    setDeleteTeamMemberId(id);
  }, [deleteTeamMemberId]);

  const processRowUpdate = useCallback((updatedRow, originalRow) => {
    console.log('process row update', updatedRow, originalRow);
    
    // Get the original role IDs
    const originalRoleIds = originalRow.moped_proj_personnel_roles
      .filter(role => !role.is_deleted)
      .map(role => role.id);

    // Get the new role IDs from the updated row
    const newRoleIds = updatedRow.roleIds || [];

    // Format the data according to the mutation's expected structure
    const variables = {
      id: updatedRow.project_personnel_id,
      updatePersonnelObject: {
        notes: updatedRow.notes,
        user_id: updatedRow.moped_user?.user_id,
      },
      // IDs of roles to be deleted (roles that were in original but not in new)
      deleteIds: originalRoleIds,
      // New role assignments
      addRolesObjects: newRoleIds.map(roleId => ({
        project_role_id: roleId,
        project_personnel_id: updatedRow.project_personnel_id
      }))
    };

    const hasRowChanged = !isEqual(updatedRow, originalRow);
    if (!hasRowChanged) {
      return Promise.resolve(updatedRow);
    } else {
      console.log('mutation variables:', variables);
      return updateProjectPersonnel({ variables })
        .then(() => refetch())
        .then(() => updatedRow)
        .catch((error) => {
          console.error(error.message);
          throw error; // Re-throw the error to be handled by handleProcessRowUpdateError
        });
    }
  }, [updateProjectPersonnel, refetch]);

  const handleProcessUpdateError = useCallback((error) => {
    console.log('process row update error', error);
  }, []);

  const handleTabKeyDown = useCallback((params, event) => {
    console.log('tab key down', params, event);
  }, []);


  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
    classes,
    teamNameLookup,
    roleNameLookup
  });

  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler errors={error}>
      <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
        ref={apiRef}
        autoHeight
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.project_personnel_id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessUpdateError}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => 'auto'}
        hideFooter
        onCellKeyDown={handleTabKeyDown}
        localeText={{ noRowsLabel: 'No team members found' }}
        disableColumnMenu
        loading={loading}
        slots={{
          toolbar: ProjectTeamToolbar,
        }}
        slotProps={{
          toolbar: {
            addAction: onClickAddTeamMember,
            classes: classes,
          },
        }}
      />
      </Box>
    </ApolloErrorHandler>
  );
};

export default ProjectTeamTableDataGridPro;
