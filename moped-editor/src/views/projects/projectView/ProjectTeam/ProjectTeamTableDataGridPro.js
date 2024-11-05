import * as React from 'react';
import { useState, useMemo, useEffect, useCallback } from "react";
import { Box, Icon, Link, CircularProgress } from '@mui/material';
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

import { EditOutlined as EditOutlinedIcon, DeleteOutline as DeleteOutlineIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import { useUser } from 'src/auth/user';

import LookupAutocompleteComponent from 'src/components/DataGridPro/LookupAutocompleteComponent';
import DataGridTextField from 'src/components/DataGridPro/DataGridTextField';

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

  const useColumns = ({
    data,
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
    classes
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
        <LookupAutocompleteComponent
          {...props}
          name={"moped_user"}
          lookupTable={data["moped_users"]}
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
      valueGetter: (roles) => {
        if (roles.length === 0) {
          return '';
        }
        const roleNames = roles.map(role => role.moped_project_role.project_role_name);
        return roleNames.join(', ');
      },
      renderEditCell: (props) => (
        <LookupAutocompleteComponent
          {...props}
          name={"moped_project_role"}
          lookupTable={data["moped_project_roles"]}
        />
      )
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
    [
      data, 
      rowModesModel, 
      handleEditClick, 
      handleSaveClick, 
      handleCancelClick, 
      handleDeleteOpen,
      classes
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

  const handleCancelClick = useCallback((id) => () => {
    console.log('cancel click', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  }, [rowModesModel]);

  const handleDeleteOpen = useCallback((id) => {
    console.log('delete open', id);
    setDeleteTeamMemberId(id);
  }, [deleteTeamMemberId]);

  const processRowUpdate = useCallback((newRow, oldRow) => {
    console.log('process row update', newRow, oldRow);
    return newRow;
  }, []);


  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
    classes
  });

  if (loading || !data) return <CircularProgress />;

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
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
            classes: classes,
          },
        }}
      />
    </Box>
  );
};

export default ProjectTeamTableDataGridPro;
