import React from "react";
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

const ProjectTeamTable = ({ projectId }) => {
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const addActionRef = React.useRef();

  const [upsertProjectPersonnel] = useMutation(UPSERT_PROJECT_PERSONNEL);

  if (loading || !data) return <CircularProgress />;

  /**
   * Returns True if it finds tupleItem in tupleList, false otherwise.
   * @param tupleList - The list of tuples
   * @param tupleItem - The tuple to search for
   * @return {boolean}
   */
  const tuplesContain = (tupleList, tupleItem) =>
    !!tupleList.find(
      (currentTuple) =>
        currentTuple[0] === tupleItem[0] && currentTuple[1] === tupleItem[1]
    );

  const availableUsers = data.moped_users;

  const makeListOfActivePersonnel = (personnelArray) => {
    // 1. Multiple roles per user comes from multiple rows in the proj_personnel table
    // so we have to dedupe project personnel and aggregate the roles to appear
    // as multiple roles per personnel row in the UI
    // 2. Similarly, personnel notes are concatenated into one string to show in the UI
    // 3. Soft deleted personnel are filtered
    let personnel = {};

    // For each personnel entry...
    personnelArray.forEach((item) => {
      // If the item does not exist in the aggregated object
      if (!personnel.hasOwnProperty(item.user_id)) {
        // instantiate a new object & populate
        personnel[`${item.user_id}`] = {
          user_id: item.user_id,
          role_id: [item.role_id],
          notes: item.notes,
          project_personnel_id: item.project_personnel_id,
          is_moped_user_deleted: item.moped_user.is_deleted,
          is_deleted: item.is_deleted,
        };
      } else {
        // Aggregate role_ids, and notes.
        personnel[`${item.user_id}`].role_id.push(item.role_id);
        personnel[`${item.user_id}`].notes = (
          (personnel[`${item.user_id}`].notes ?? "") +
          " " +
          item.notes
        ).trim();
        personnel[`${item.user_id}`].project_personnel_id =
          item.project_personnel_id;
      }
    });

    const personnelTableList = Object.keys(personnel).map(
      (item) => personnel[item]
    );

    // Filter soft deleted project personnel
    const activePersonnelList = personnelTableList.filter(
      (personnel) => personnel.is_deleted === false
    );

    return activePersonnelList;
  };

  // Create some objects for lookups
  const workgroups = data.moped_workgroup.reduce(
    (acc, workgroup) => ({
      ...acc,
      [workgroup?.workgroup_id ?? 0]: workgroup?.workgroup_name ?? "N/A",
    }),
    {}
  );
  const roles = data.moped_project_roles.reduce(
    (acc, role) => ({
      ...acc,
      [role?.project_role_id ?? 0]: role?.project_role_name ?? "N/A",
    }),
    {}
  );

  const roleDescriptions = data.moped_project_roles.reduce(
    (acc, role) => ({
      ...acc,
      [role?.project_role_id ?? 0]: role?.project_role_description ?? "N/A",
    }),
    {}
  );

  // Options for Autocomplete form elements filtered to active users
  const userIds = availableUsers
    .filter((user) => user.is_deleted === false)
    .map((user) => user.user_id);

  /**
   * Get a user object from the users array
   * @param {number} id - User id from the moped project personnel row
   * @return {object} Object containing user data
   */
  const getUserById = (id) =>
    availableUsers.find((user) => user.user_id === id);

  /**
   * Get personnel name from their user ID
   * @param {number} id - User id from the moped project personnel row
   * @return {string} Full name of user
   */
  const getPersonnelName = (id) => {
    const user = getUserById(id);
    return getUserFullName(user);
  };

  /**
   * Get personnel workgroup from their user ID
   * @param {number} id - User id from the moped project personnel row
   * @return {string} Workgroup name of the user
   */
  const getPersonnelWorkgroup = (id) => {
    const user = getUserById(id);
    return workgroups[user?.workgroup_id ?? 0];
  };

  /**
   * Get string of role names from roleIDs
   * @param {Array} rolesArray - Array of roleIDs
   * @return {string} roles separated by comma and space
   */
  const getPersonnelRoles = (rolesArray) => {
    const roleNames = rolesArray.map((roleId) => roles[roleId]);
    return roleNames.join(", ");
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "user_id",
      render: (personnel) => {
        const { is_moped_user_deleted } = personnel;

        return is_moped_user_deleted ? (
          <Typography className={classes.inactiveUserText}>{`${getPersonnelName(
            personnel.user_id
          )} - Inactive`}</Typography>
        ) : (
          <Typography>{getPersonnelName(personnel.user_id)}</Typography>
        );
      },
      validate: (rowData) => !!rowData.user_id,
      editComponent: (props) => (
        <FormControl style={{ width: "100%" }}>
          <Autocomplete
            id="user_id"
            name="user_id"
            options={userIds}
            getOptionLabel={(option) => getPersonnelName(option)}
            getOptionSelected={(option, value) => option === value}
            value={props.value || null}
            onChange={(event, value) => props.onChange(value)}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
    },
    {
      title: "Workgroup",
      render: (personnel) => (
        <Typography>{getPersonnelWorkgroup(personnel.user_id)}</Typography>
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
      field: "role_id",
      render: (personnel) => (
        <Typography>{getPersonnelRoles(personnel.role_id)}</Typography>
      ),
      validate: (rowData) =>
        Array.isArray(rowData.role_id) && rowData.role_id.length > 0,
      editComponent: (props) => (
        <ProjectTeamRoleMultiselect
          id="role_id"
          name="role_id"
          initialValue={props.rowData.role_id}
          value={props.value}
          onChange={props.onChange}
          roles={roles}
          roleDescriptions={roleDescriptions}
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
        data={makeListOfActivePersonnel(data.moped_proj_personnel)}
        title={
          <Typography variant="h2" color="primary">
            Project team
          </Typography>
        }
        options={{
          ...(data.moped_proj_personnel.length < PAGING_DEFAULT_COUNT + 1 && {
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
            // Our new data is unique, we will attempt upsert since
            // we may have existing data in our table
            const personnelData = newData.role_id.map((roleId, index) => {
              return {
                project_id: Number.parseInt(projectId),
                user_id: newData.user_id,
                role_id: roleId,
                notes: index === 0 ? newData.notes : "",
              };
            });

            // Upsert as usual
            return upsertProjectPersonnel({
              variables: {
                objects: personnelData,
              },
            }).then(() => refetch());
          },
          onRowUpdate: (newData, oldData) => {
            // Creates a set of tuples that contain the user id and the role comprised by the new state
            const newStateTuples = newData.role_id.map((role_id) => [
              newData.user_id,
              role_id,
            ]);

            // Creates a set of tuples that contain the user id and role comprised by the old state
            const oldStateTuples = oldData.role_id.map((role_id) => [
              oldData.user_id,
              role_id,
            ]);

            /**
             * From the old state, we need to remove the tuples that are not present
             * in the new state, these tuples are 'orphans' and need to be archived.
             */
            const orphanData = oldStateTuples.filter(
              (oldTuple) => !tuplesContain(newStateTuples, oldTuple)
            );

            /**
             * We must build a unique set of tuples so that there are no repeated
             * operations run against the database
             */
            const uniqueSetOfTuples = [
              ...newStateTuples,
              ...oldStateTuples,
            ].reduce((accumulator, item) => {
              if (!tuplesContain(accumulator, item)) accumulator.push(item);
              return accumulator;
            }, []);

            // Removed ids means they are not present in new data,
            const updatedPersonnelData = uniqueSetOfTuples.map(
              (currentTuple, index) => {
                return {
                  project_id: Number.parseInt(projectId),
                  user_id: currentTuple[0],
                  role_id: currentTuple[1],
                  is_deleted: tuplesContain(orphanData, currentTuple)
                    ? true
                    : false,
                  notes: index === 0 ? newData.notes : "",
                };
              }
            );

            return upsertProjectPersonnel({
              variables: {
                objects: updatedPersonnelData,
              },
            }).then(() => refetch());
          },
          onRowDelete: (oldData) => {
            // We will soft delete by marking as is_deleted = true
            const updatedPersonnelData = oldData.role_id.map(
              (roleId, index) => {
                return {
                  project_id: Number.parseInt(projectId),
                  user_id: oldData.user_id,
                  role_id: roleId,
                  is_deleted: true,
                  notes: index === 0 ? oldData.notes : "",
                };
              }
            );
            // Upsert as usual
            return upsertProjectPersonnel({
              variables: {
                objects: updatedPersonnelData,
              },
            }).then(() => refetch());
          },
        }}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectTeamTable;
