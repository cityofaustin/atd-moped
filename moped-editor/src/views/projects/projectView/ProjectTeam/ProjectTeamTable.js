import { useState, useMemo, useEffect, useCallback } from "react";
import isEqual from "lodash.isequal";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Button,
  Icon,
  Link,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { DataGridPro, GridRowModes, useGridApiRef } from "@mui/x-data-grid-pro";
import { useQuery, useMutation } from "@apollo/client";

import {
  TEAM_QUERY,
  UPDATE_PROJECT_PERSONNEL,
  INSERT_PROJECT_PERSONNEL,
  DELETE_PROJECT_PERSONNEL,
} from "src/queries/project";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import ProjectTeamRoleMultiselect from "./ProjectTeamRoleMultiselect";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import ViewOnlyTextField from "src/components/DataGridPro/ViewOnlyTextField";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import { mopedUserAutocompleteProps } from "./utils";
import { handleRowEditStop } from "src/utils/dataGridHelpers";

const useWorkgroupLookup = (data) =>
  useMemo(() => {
    if (!data) {
      return {};
    }
    return data.moped_workgroup.reduce((obj, item) => {
      obj[item.workgroup_id] = item.workgroup_name;
      return obj;
    }, {});
  }, [data]);

// returns a list of user ids for the existing team members on this project
const useExistingTeamMembers = (data) =>
  useMemo(() => {
    return data?.moped_project_by_pk?.moped_proj_personnel.map(
      (option) => option.moped_user.user_id
    );
  }, [data]);

const requiredFields = ["moped_user", "moped_proj_personnel_roles"];

const useColumns = ({
  data,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  handleDeleteOpen,
  usingShiftKey,
  workgroupLookup,
  existingTeamMembers,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Name",
        field: "moped_user",
        width: 250,
        editable: true,
        valueFormatter: (user) => {
          return user ? `${user.first_name} ${user.last_name}` : "";
        },
        sortComparator: (v1, v2) =>
          `${v1.first_name} ${v1.last_name}`.localeCompare(
            `${v2.first_name} ${v2.last_name}`
          ),
        renderEditCell: (props) => {
          // the team member object for the current row
          const currentRowMember =
            data?.moped_project_by_pk?.moped_proj_personnel.find(
              (user) => user.project_personnel_id === props.id
            );
          // filter out existing team members from list of options unless they are the current row member
          // that way the current member remains an option when editing a row
          const unassignedTeamMembers = data?.moped_users.filter((user) => {
            return (
              !existingTeamMembers.includes(user.user_id) ||
              user.user_id === currentRowMember?.moped_user.user_id
            );
          });
          return (
            <LookupAutocompleteComponent
              {...props}
              name={"user"}
              value={props.row.moped_user}
              options={unassignedTeamMembers}
              autocompleteProps={mopedUserAutocompleteProps}
              textFieldProps={{
                error: props.error,
                helperText: "Required",
              }}
              dependentFieldsArray={[
                {
                  fieldName: "moped_workgroup",
                  setFieldValue: (newValue) => ({
                    workgroup_id: newValue?.workgroup_id,
                    workgroup_name: workgroupLookup[newValue?.workgroup_id],
                  }),
                },
              ]}
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
        editable: true,
        width: 250,
        valueFormatter: (workgroup) => workgroup?.workgroup_name ?? "",
        sortComparator: (v1, v2) =>
          v1.workgroup_name.localeCompare(v2.workgroup_name),
        renderEditCell: (props) => (
          <ViewOnlyTextField
            {...props}
            lookupTable={workgroupLookup}
            usingShiftKey={usingShiftKey}
            previousColumnField="moped_user"
            nextColumnField="moped_proj_personnel_roles"
            valueIdName="workgroup_id"
          />
        ),
      },
      {
        headerName: "Role",
        field: "moped_proj_personnel_roles",
        width: 200,
        editable: true,
        sortable: false,
        renderHeader: () => (
          <Box sx={{ fontWeight: 500 }}>
            Role{" "}
            <Link
              href="dev/lookups#moped-project_roles"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                sx={{
                  fontSize: "1rem !important",
                  verticalAlign: "sub",
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                info_outline
              </Icon>
            </Link>
          </Box>
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
    usingShiftKey,
    workgroupLookup,
    existingTeamMembers,
  ]);

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

const ProjectTeamTable = ({ projectId, handleSnackbar }) => {
  const apiRef = useGridApiRef();

  const { loading, data, refetch } = useQuery(TEAM_QUERY, {
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
  const [usingShiftKey, setUsingShiftKey] = useState(false);

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

  const workgroupLookup = useWorkgroupLookup(data);

  const existingTeamMembers = useExistingTeamMembers(data);

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
        moped_user: {},
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
    (updatedRow, originalRow) => {
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
        console.error(
          "Invalid user data, user not found:",
          updatedRow.moped_user
        );
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
            handleSnackbar(true, "Team member added", "success");
          })
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(true, "Error adding team member", "error", error);
            throw error;
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
            handleSnackbar(true, "Team member updated", "success");
          })
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(true, "Error updating team member", "error", error);
            throw error;
          });
      }
    },
    [
      data,
      insertProjectPersonnel,
      updateProjectPersonnel,
      projectId,
      refetch,
      handleSnackbar,
    ]
  );

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteOpen,
    usingShiftKey,
    workgroupLookup,
    existingTeamMembers,
  });

  const getRowIdMemoized = useCallback((row) => row.project_personnel_id, []);

  if (loading || !data) return <CircularProgress />;

  const checkIfShiftKey = (params, event) => {
    if (params.cellMode === GridRowModes.Edit && event.key === "Tab") {
      setUsingShiftKey(event.shiftKey);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <>
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
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop(rows, setRows)}
        onProcessRowUpdateError={(error) => {
          console.error("Unexpected error in processRowUpdate:", error);
        }}
        processRowUpdate={processRowUpdate}
        onCellKeyDown={checkIfShiftKey}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No team members found" }}
        disableColumnMenu
        loading={loading}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Team",
            primaryActionButton: (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={onClickAddTeamMember}
              >
                Add team member
              </Button>
            ),
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
              setIsDeleteConfirmationOpen(false);
              handleSnackbar(true, "Team member removed", "success");
            })
            .catch((error) => {
              handleSnackbar(
                true,
                "Error removing team member",
                "error",
                error
              );
            });
        }}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </>
  );
};

export default ProjectTeamTable;
