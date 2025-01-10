import { useState, useMemo, useEffect, useCallback } from "react";
import isEqual from "lodash/isEqual";
import { v4 as uuidv4 } from "uuid";

import { Box, Icon, Link, CircularProgress, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import { DataGridPro, GridRowModes, useGridApiRef } from "@mui/x-data-grid-pro";
import { useQuery, useMutation } from "@apollo/client";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";

import {
  TEAM_QUERY,
  UPDATE_PROJECT_PERSONNEL,
  INSERT_PROJECT_PERSONNEL,
  DELETE_PROJECT_PERSONNEL,
} from "src/queries/project";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import ProjectTeamToolbar from "./ProjectTeamToolbar";
import ProjectTeamRoleMultiselect from "./ProjectTeamRoleMultiselect";
import TeamAutocompleteComponent from "./TeamAutocompleteComponent";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const useStyles = makeStyles((theme) => ({
  infoIcon: {
    fontSize: "1rem",
    verticalAlign: "sub",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  roleHeader: {
    fontWeight: 500,
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

const requiredFields = ["moped_user", "moped_proj_personnel_roles"];

const useColumns = ({
  data,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  handleDeleteOpen,
  classes,
  teamNameLookup,
  roleNameLookup,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Name",
        field: "moped_user",
        width: 250,
        editable: true,
        valueGetter: (user) => {
          return user ? `${user.first_name} ${user.last_name}` : "";
        },
        renderEditCell: (props) => {
          return (
            <TeamAutocompleteComponent
              {...props}
              name={"user"}
              value={props.row.moped_user}
              nameLookup={teamNameLookup}
              error={props.error}
            />
          );
        },
        preProcessEditCellProps: (params) => {
          // Enforce required field
          const hasError =
            !params.props.value || params.props.value.length === 0;
          return { ...params.props, error: hasError };
        },
      },
      {
        headerName: "Workgroup",
        field: "moped_workgroup",
        width: 200,
        valueGetter: (workgroup) => workgroup?.workgroup_name,
      },
      {
        headerName: "Role",
        field: "moped_proj_personnel_roles",
        width: 200,
        editable: true,
        renderHeader: () => (
          <div className={classes.roleHeader}>
            Role{" "}
            <Link
              href="https://atd-dts.gitbook.io/moped/user-guides/project-team"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className={classes.infoIcon}>info_outline</Icon>
            </Link>
          </div>
        ),
        renderCell: (params) => {
          // Filter out deleted roles and map to Typography components
          const roleElements = params.row.moped_proj_personnel_roles
            .filter((role) => !role.is_deleted)
            .map((role) => (
              <Typography
                key={role.moped_project_role?.project_role_id}
                sx={{ fontSize: "0.875rem" }}
              >
                {role.moped_project_role?.project_role_name}
              </Typography>
            ));

          return <Box>{roleElements}</Box>;
        },
        renderEditCell: (props) => {
          return (
            <ProjectTeamRoleMultiselect
              {...props}
              value={props.row.moped_proj_personnel_roles || []}
              roles={data.moped_project_roles}
              error={props.error}
            />
          );
        },
        preProcessEditCellProps: (params) => {
          // Enforce required field
          const hasError =
            !params.props.value || params.props.value.length === 0;
          return { ...params.props, error: hasError };
        },
      },
      {
        headerName: "Notes",
        field: "notes",
        width: 200,
        editable: true,
        renderEditCell: (props) => <DataGridTextField {...props} multiline />,
      },
      {
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
        type: "actions",
        renderCell: ({ id }) => (
          <DataGridActions
            id={id}
            requiredFields={requiredFields}
            rowModesModel={rowModesModel}
            handleCancelClick={handleCancelClick}
            handleDeleteOpen={handleDeleteOpen}
            handleSaveClick={handleSaveClick}
            handleEditClick={handleEditClick}
          />
        ),
      },
    ];
  }, [
    data,
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
    classes,
    teamNameLookup,
  ]);

const ProjectTeamTable = ({ projectId, snackbarHandle }) => {
  const apiRef = useGridApiRef();
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const [insertProjectPersonnel] = useMutation(INSERT_PROJECT_PERSONNEL);
  const [updateProjectPersonnel] = useMutation(UPDATE_PROJECT_PERSONNEL);
  const [deleteProjectPersonnel] = useMutation(DELETE_PROJECT_PERSONNEL);

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  useEffect(() => {
    if (data?.moped_project_by_pk?.moped_proj_personnel?.length > 0) {
      // Set the rows but add the workgroup name to the row data
      // instead of being nested under moped_user.
      setRows(
        data.moped_project_by_pk.moped_proj_personnel.map((personnel) => ({
          ...personnel,
          moped_workgroup: personnel.moped_user.moped_workgroup,
        }))
      );
    } else {
      setRows([]); // Reset rows when no data is available
    }
  }, [data]);

  const teamNameLookup = useTeamNameLookup(data);
  const roleNameLookup = useRoleNameLookup(data);

  /**
   * Construct a moped_project_personnel object that can be passed to an insert mutation
   * @param {Object} newData - a table row object with { moped_user, notes, roleIds }
   * @param {integer} projectId - the project ID
   * @return {Object} a moped_project_personnel object: { user_id, notes, moped_proj_personnel_roles: { project_role_id } }
   */

  const getNewPersonnelPayload = ({
    newData: {
      moped_user: { user_id },
      notes,
      moped_proj_personnel_roles,
    },
    projectId: project_id,
  }) => {
    const payload = { notes, project_id, user_id };
    const personnelRoles = moped_proj_personnel_roles.map((roles) => ({
      project_role_id: roles.project_role_id,
    }));

    payload.moped_proj_personnel_roles = { data: personnelRoles };
    return payload;
  };

  /**
   * Construct a moped_project_personnel object that can be passed to an update mutation
   * @param {Object} newData - a table row object with { moped_user, notes, roleIds }
   * @param {integer} projectId - the project ID
   * @return {Object} a moped_project_personnel object: { user_id, notes } <- observe that `moped_proj_personnel_roles`
   *  is handled separately
   */
  const getEditPersonnelPayload = (newData) => {
    const {
      moped_user: { user_id },
      notes,
    } = newData;
    return { user_id, notes };
  };

  /**
   * Constructs payload objects for adding and removing moped_proj_personnel_roles
   * @param {Object} newData - a table row object with the new values
   * @param {Object} oldData - a table row object with the old values
   * @return {[[Object], [Int]]} - an array of new personnel role objects, and an array of existing
   *  personnel role objects to delete
   */
  const getEditRolesPayload = (newData, oldData) => {
    const { project_personnel_id } = oldData;

    // get an array of moped_proj_personnel_roles IDs to delete
    const projRoleIdsToDelete = oldData.moped_proj_personnel_roles
      .filter((projRole) => {
        const roleId = projRole.moped_project_role.project_role_id;
        return !newData.roleIds.includes(roleId);
      })
      .map((projRole) => projRole.id);

    // construct an array of new moped_proj_personnel_roles objects
    const existingRoleIds = oldData.moped_proj_personnel_roles.map(
      ({ moped_project_role }) => moped_project_role.project_role_id
    );
    const roleIdsToAdd = newData.roleIds.filter(
      (roleId) => !existingRoleIds.includes(roleId)
    );
    const rolesToAddPayload = roleIdsToAdd.map((newRoleId) => ({
      project_personnel_id,
      project_role_id: newRoleId,
    }));
    return [rolesToAddPayload, projRoleIdsToDelete];
  };

  const onClickAddTeamMember = () => {
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        name: null,
        moped_workgroup: null,
        moped_proj_personnel_roles: [],
        notes: null,
        isNew: true,
        roleIds: [],
        project_personnel_id: id,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "moped_user" },
    }));
  };

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const handleCancelClick = useCallback(
    (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows.find((row) => row.project_personnel_id === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    },
    [rowModesModel, rows]
  );

  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  const processRowUpdate = useCallback(
    (updatedRow, originalRow, params, data) => {
      let userId;

      const userObject = data.moped_users.find((user) => {
        if (typeof updatedRow.moped_user === "string") {
          return (
            `${user.first_name} ${user.last_name}` === updatedRow.moped_user
          );
        } else {
          return user.user_id === updatedRow.moped_user.user_id;
        }
      });

      if (userObject) {
        userId = userObject.user_id;
        updatedRow.moped_user = userObject; // Update with full user object
      } else {
        console.error("Invalid user data:", updatedRow.moped_user);
        throw new Error("Invalid user data");
      }

      // normalize the updatedRow and originalRow
      const normalizedUpdatedRow = {
        ...updatedRow,
        roleIds: updatedRow.moped_proj_personnel_roles.map(
          (role) => role.project_role_id
        ),
        moped_user: updatedRow.moped_user?.user_id || null,
      };
      const normalizedOriginalRow = {
        ...originalRow,
        roleIds: originalRow.moped_proj_personnel_roles.map(
          (role) => role.project_role_id
        ),
        moped_user: originalRow.moped_user?.user_id || null,
      };

      // Check if the row has changed, including the roles array
      const hasRowChanged = !isEqual(
        normalizedUpdatedRow,
        normalizedOriginalRow
      );
      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      }

      if (updatedRow.isNew) {
        const payload = getNewPersonnelPayload({
          newData: updatedRow,
          projectId,
        });

        return insertProjectPersonnel({
          variables: {
            object: payload,
          },
        })
          .then(() => {
            refetch();
            snackbarHandle(true, "Team member added", "success");
          })
          .then(() => updatedRow)
          .catch((error) => {
            console.error("Mutation error:", error);
            snackbarHandle(true, `Team member not added: ${error}`, "error");
          });
      } else {
        // Ensure project_personnel_id is an integer
        const personnelId = parseInt(updatedRow.project_personnel_id);

        if (!personnelId) {
          console.error(
            "Invalid project_personnel_id:",
            updatedRow.project_personnel_id
          );
          throw new Error("Invalid project_personnel_id");
        }

        // Update roleIds to be in sync with moped_proj_personnel_roles
        updatedRow.roleIds = updatedRow.moped_proj_personnel_roles.map(
          (role) => role.project_role_id
        );

        const payload = getEditPersonnelPayload(updatedRow);
        const [rolesToAdd, roleIdsToDelete] = getEditRolesPayload(
          updatedRow,
          originalRow
        );

        // get update name
        payload.user_id = userId;

        const fullMopedUserObject = data.moped_users.find(
          (user) => user.user_id === userId
        );
        updatedRow.moped_user = fullMopedUserObject;

        const variables = {
          id: personnelId,
          updatePersonnelObject: payload,
          deleteIds: roleIdsToDelete,
          addRolesObjects: rolesToAdd,
        };

        return updateProjectPersonnel({ variables })
          .then(() => {
            refetch();
            snackbarHandle(true, "Team member updated", "success");
          })
          .then(() => updatedRow)
          .catch((error) => {
            console.error("Mutation error:", error);
            snackbarHandle(true, `Team member not updated: ${error}`, "error");
          });
      }
    },
    [updateProjectPersonnel, insertProjectPersonnel, projectId, refetch]
  );

  const handleProcessUpdateError = useCallback((error) => {
    console.error("process row update error", error);
    snackbarHandle(true, `Process for update error: ${error}`, "error");
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
    roleNameLookup,
  });

  const processRowUpdateMemoized = useCallback(
    (updatedRow, originalRow, params) =>
      processRowUpdate(updatedRow, originalRow, params, data),
    [processRowUpdate, data]
  );

  const getRowIdMemoized = useCallback((row) => row.project_personnel_id, []);

  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler errors={error}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
        ref={apiRef}
        autoHeight
        columns={dataGridColumns}
        rows={rows}
        getRowId={getRowIdMemoized}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdateMemoized}
        onProcessRowUpdateError={handleProcessUpdateError}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No team members found" }}
        disableColumnMenu
        loading={loading}
        slots={{
          toolbar: ProjectTeamToolbar,
        }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        slotProps={{
          toolbar: {
            addAction: onClickAddTeamMember,
            classes: classes,
          },
        }}
      />
      <DeleteConfirmationModal
        type="team member"
        submitDelete={() => {
          deleteProjectPersonnel({
            variables: { id: deleteConfirmationId },
          })
            .then(() => {
              refetch();
              snackbarHandle(true, "Team member removed", "success");
              setIsDeleteConfirmationOpen(false);
            })
            .catch((error) => {
              console.error("Mutation error:", error);
              snackbarHandle(
                true,
                `Team member not removed: ${error}`,
                "error"
              );
            });
        }}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectTeamTable;
