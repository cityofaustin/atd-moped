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

import { TEAM_QUERY, UPSERT_PROJECT_PERSONNEL } from "../../../queries/project";

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
 * Get string of role names from roleIDs
 * @param {Array} projRolesArray - Array of moped_proj_personnel_roles
 * @return {string} role names separated by comma and space
 */
const getPersonnelRoles = (projRolesArray) => {
  const roleNames = projRolesArray.map(
    ({ moped_project_role }) => moped_project_role.project_role_name
  );
  return roleNames.join(", ");
};

/**
 * Adds a `roleIds`property to each team member
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

const ProjectTeamTable = ({ projectId }) => {
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const addActionRef = React.useRef();

  const [upsertProjectPersonnel] = useMutation(UPSERT_PROJECT_PERSONNEL);

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
      render: (personnel) => (
        <Typography>
          {getPersonnelRoles(personnel.moped_proj_personnel_roles)}
        </Typography>
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
            console.log("new row");
            return Promise.resolve();
          },
          onRowUpdate: (newData, oldData) => {
            console.log("do an update");
            return Promise.resolve();
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
