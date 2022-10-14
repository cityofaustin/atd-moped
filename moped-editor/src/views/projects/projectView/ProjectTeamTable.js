import React, { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  Icon,
  Link,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import typography from "../../../theme/typography";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  TEAM_QUERY,
  UPDATE_PROJECT_PERSONNEL,
  INSERT_PROJECT_PERSONNEL,
} from "../../../queries/project";

import ProjectTeamRoleMultiselect from "./ProjectTeamRoleMultiselect";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { getUserFullName } from "src/utils/userNames";

const useStyles = makeStyles((theme) => ({
  infoIcon: {
    fontSize: "1.25rem",
    verticalAlign: "sub",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  inactiveUserText: {
    fontStyle: "italic",
  },
}));

/**
 * Adds a `roleIds` property to each team member - which we'll use as the i/o for the
 *  moped_project_role multiselect
 * @param {Array} projPersonnel - An array of of moped_proj_personnel objects
 * @return {string} the same array, with a `roleIds` prop added to each object
 */
const usePersonnel = (projPersonnel) =>
  useMemo(() => {
    if (!projPersonnel) return projPersonnel;
    projPersonnel.forEach((person) => {
      const roleIds = person.moped_proj_personnel_roles.map(
        ({ moped_project_role }) => moped_project_role.project_role_id
      );
      person.roleIds = roleIds;
    });
    return projPersonnel;
  }, [projPersonnel]);

/**
 * Construct a moped_project_personnel object that can be passed to a mutation payload
 * @param {Object} newData - a "row" object from Material table
 * * @param {integer} projectId - the project ID
 * @return {Ojbect} a moped_project_personnel object
 */
const getNewPersonnelPayload = ({
  newData: {
    moped_user: { user_id },
    notes,
    roleIds,
  },
  projectId: project_id,
}) => {
  const payload = { notes, project_id, user_id };
  const personnelRoles = roleIds.map((roleId) => ({
    project_role_id: roleId,
  }));
  payload["moped_proj_personnel_roles"] = { data: personnelRoles };
  return payload;
};

const getEditPersonnelPayload = ({ newData, oldData }) => {
  // and the new values
  const {
    moped_user: { user_id },
    notes,
  } = newData;
  return { user_id, notes };
};

const getEditRolesPayload = ({ newData, oldData }) => {
  // identify existing role records to delete
  const { project_personnel_id } = oldData;

  const projRoleIdsToDelete = oldData.moped_proj_personnel_roles
    .filter((projRole) => {
      const roleId = projRole.moped_project_role.project_role_id;
      return !newData.roleIds.includes(roleId);
    })
    .map((projRole) => projRole.id);

  // check for new roles
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

const ProjectTeamTable = ({ projectId }) => {
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const addActionRef = React.useRef();

  const [updateProjectPersonnel] = useMutation(UPDATE_PROJECT_PERSONNEL);
  const [insertProjectPersonnel] = useMutation(INSERT_PROJECT_PERSONNEL);

  const personnel = usePersonnel(
    data?.moped_project_by_pk.moped_proj_personnel
  );
  const roles = data?.moped_project_roles;
  const userOptions = data?.moped_users || [];

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "moped_user",
      render: (personnel) => {
        const isDeleted = personnel?.moped_user.is_deleted;
        const fullName = getUserFullName(personnel.moped_user);

        return isDeleted ? (
          <Typography
            className={classes.inactiveUserText}
          >{`${fullName} - Inactive`}</Typography>
        ) : (
          <Typography>{fullName}</Typography>
        );
      },
      validate: (rowData) => !!rowData?.moped_user?.user_id,
      editComponent: (props) => {
        return (
          <FormControl style={{ width: "100%" }}>
            <Autocomplete
              id="user_id"
              name="user_id"
              options={userOptions}
              getOptionLabel={(option) => getUserFullName(option)}
              getOptionSelected={(option, value) =>
                option.user_id === value.user_id
              }
              value={props.value || null}
              onChange={(event, value) => props.onChange(value)}
              renderInput={(params) => <TextField {...params} />}
            />
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        );
      },
    },
    {
      title: "Workgroup",
      render: (personnel) => (
        <Typography>
          {personnel.moped_user.moped_workgroup.workgroup_name}
        </Typography>
      ),
    },
    {
      title: (
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
      field: "roleIds",
      render: (personnel) =>
        personnel.moped_proj_personnel_roles.map(
          ({ id, moped_project_role }) => (
            <Typography key={id}>
              {moped_project_role.project_role_name}
            </Typography>
          )
        ),
      validate: (rowData) => rowData?.roleIds?.length > 0,
      editComponent: (props) => (
        <ProjectTeamRoleMultiselect
          id="role_ids"
          name="role_ids"
          value={props.value || []}
          onChange={props.onChange}
          roles={roles}
        />
      ),
    },
    {
      title: "Notes",
      field: "notes",
      render: (props) => (props.notes === "null" ? "" : props.notes),
      editComponent: (props) => {
        const val = props.value ?? "";
        return (
          <TextField
            id="notes"
            name="notes"
            multiline
            inputProps={{ maxLength: 125 }}
            value={val && val !== "null" ? val : ""}
            onChange={(e) => props.onChange(e.target.value)}
          />
        );
      },
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
        components={{
          EditRow: (props) => (
            <MTableEditRow
              {...props}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                  // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                }
              }}
            />
          ),
          Action: (props) => {
            // If isn't the add action
            if (
              typeof props.action === typeof Function ||
              props.action.tooltip !== "Add"
            ) {
              return <MTableAction {...props} />;
            } else {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
                  onClick={props.action.onClick}
                >
                  Add team member
                </Button>
              );
            }
          },
        }}
        data={personnel}
        title={
          <Typography variant="h2" color="primary">
            Project team
          </Typography>
        }
        options={{
          ...(data?.moped_proj_personnel?.length < PAGING_DEFAULT_COUNT + 1 && {
            paging: false,
          }),
          search: false,
          rowStyle: { fontFamily: typography.fontFamily },
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: (
              <Typography variant="body1">
                No team members to display
              </Typography>
            ),
          },
        }}
        icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
        editable={{
          onRowAdd: (newData) => {
            const payload = getNewPersonnelPayload({ newData, projectId });
            return insertProjectPersonnel({
              variables: {
                object: payload,
              },
            }).then(() => refetch());
          },
          onRowUpdate: async (newData, oldData) => {
            const { project_personnel_id } = oldData;
            const payload = getEditPersonnelPayload({
              newData,
              oldData,
            });
            const [rolesToAdd, roleIdsToDelete] = getEditRolesPayload({
              newData,
              oldData,
            });

            return updateProjectPersonnel({
              variables: {
                updatePersonnelObject: payload,
                id: project_personnel_id,
                deleteIds: roleIdsToDelete,
                addRolesObjects: rolesToAdd,
              },
            }).then(() => refetch());
          },
          onRowDelete: (oldData) => {
            console.log("do a delete");
            return Promise.resolve();
          },
        }}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectTeamTable;
